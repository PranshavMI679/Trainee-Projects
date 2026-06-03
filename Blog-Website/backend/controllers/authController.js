const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const NotificationService = require('../utils/notificationService');
const nodemailer = require('nodemailer');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
  
    const normalizedEmail = email ? email.trim().toLowerCase() : email;

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return next(new AppError(ErrorMessages.AUTH.USER_ALREADY_EXISTS, 400));
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userRole = 'user';
    console.log(userRole);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password_hash,
      role: userRole
    });
    
    const token = jwt.sign(
      { user_id: newUser.user_id, role: newUser.role, name: newUser.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    await NotificationService.trigger({
      io: req.io,
      userId: newUser.user_id,
      mainType: 'updates',
      subType: 'signup',
      metadata: {},
      userEmail: newUser.email
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { 
        user_id: newUser.user_id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const normalizedEmail = email ? email.trim().toLowerCase() : email;
    
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return next(new AppError(ErrorMessages.AUTH.INVALID_CREDENTIALS, 400));
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    await NotificationService.trigger({
      io: req.io,
      userId: user.user_id,
      mainType: 'messages',
      subType: 'logged in',
      metadata: { username: user.name },
      userEmail: null
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: { 
        user_id: user.user_id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const normalizedEmail = email ? email.trim().toLowerCase() : email;

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return next(new AppError(ErrorMessages.RESOURCE.USER_EMAIL_NOT_FOUND, 404));
    }

    const secret = process.env.JWT_SECRET + user.password_hash;
    const resetToken = jwt.sign(
      { user_id: user.user_id }, 
      secret, 
      { expiresIn: '1h' }
    );

    const resetURL = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Blog Platform" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Verification',
        html: `
          <p>Hello ${user.name},</p>
          <p>A request was received to reset your account password.</p>
          <p>Please click the button link below to reset your password (Valid for 1 hour):</p>
          <a href="${resetURL}" target="_blank" style="padding:10px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:5px; display:inline-block;">Reset Password</a>
          <p>Fallback link: ${resetURL}</p>
        `
      });
      console.log(`Reset email sent out to ${user.email}`);
    } catch (mailError) {
      console.error('Nodemailer Error Log:', mailError.message);
      return next(new AppError('Email delivery service failed. Verify environment configuration.', 500));
    }

    return res.status(200).json({
      success: true,
      message: "Password reset verification link has been sent to your email registry."
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return next(new AppError(ErrorMessages.VALIDATION.TOKEN_REQUIRED, 400));
    }

    const decodedToken = jwt.decode(token);
    if (!decodedToken || !decodedToken.user_id) {
      return next(new AppError(ErrorMessages.STATE.TOKEN_INVALID_EXPIRED, 400));
    }

    const user = await User.findByPk(decodedToken.user_id);
    if (!user) {
      return next(new AppError(ErrorMessages.STATE.TOKEN_INVALID_EXPIRED, 400));
    }

    try {
      const secret = process.env.JWT_SECRET + user.password_hash;
      jwt.verify(token, secret);
    } catch (jwtError) {
      return next(new AppError(ErrorMessages.STATE.TOKEN_INVALID_EXPIRED, 400));
    }

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(password, salt);
    await user.save();

    await NotificationService.trigger({
      io: req.io,
      userId: user.user_id,
      mainType: 'updates',
      subType: 'password updated',
      metadata: { username: user.name },
      userEmail: user.email
    });

    return res.status(200).json({
      success: true,
      message: "Your password has been updated successfully."
    });
  } catch (error) {
    return next(error);
  }
};
