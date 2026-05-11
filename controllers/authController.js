const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const crypto = require('crypto');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUsers = await sequelize.query(
      'SELECT * FROM "Users" WHERE email = :email LIMIT 1',
      { replacements: { email }, type: QueryTypes.SELECT }
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const new_user_id = crypto.randomUUID();
    
    const userRole = role === 'admin' ? 'admin' : 'user';

    const insertedUsers = await sequelize.query(
      `INSERT INTO "Users" (user_id, name, email, password_hash, role, created_at) 
       VALUES (:user_id, :name, :email, :password_hash, :role, CURRENT_TIMESTAMP) 
       RETURNING *`,
      {
        replacements: { 
          user_id: new_user_id, 
          name, email, password_hash, 
          role: userRole 
        },
        type: QueryTypes.SELECT
      }
    );

    const newUser = insertedUsers[0];
    
    const token = jwt.sign(
      { user_id: newUser.user_id, role: newUser.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { user_id: newUser.user_id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await sequelize.query(
      'SELECT * FROM "Users" WHERE email = :email LIMIT 1',
      { replacements: { email }, type: QueryTypes.SELECT }
    );

    const user = users.length > 0 ? users[0] : null;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
