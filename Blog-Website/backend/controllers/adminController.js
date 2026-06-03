const { BlogPost, Feedback, User, Category } = require('../models');
const { v4: uuidv4 } = require('uuid');
const NotificationService = require('../utils/notificationService');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.getPendingBlogs = async (req, res, next) => {
  try {
    const pendingBlogs = await BlogPost.findAll({
      where: { status: 'approval pending' },
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }]
    });

    const admin_id = req.user?.id || req.user?.user_id || req.user?.userId;
    if (admin_id) {
      await NotificationService.trigger({
        io: req.io,
        userId: admin_id,
        mainType: 'updates',
        subType: 'pending(admin)',
        metadata: { count: pendingBlogs.length },
        userEmail: null
      });
    }

    return res.status(200).json({
      success: true,
      count: pendingBlogs.length,
      data: pendingBlogs
    });
  } catch (error) {
    return next(error);
  }
};

exports.recheckBlog = async (req, res, next) => {
  const { blog_id } = req.params;
  const { feedback_content } = req.body;
  const admin_id = req.user?.id || req.user?.user_id || req.user?.userId;

  try {
    const blog = await BlogPost.findByPk(blog_id);
    if (!blog) {
      return next(new AppError(ErrorMessages.RESOURCE.BLOG_NOT_FOUND, 404));
    }

    if (blog.status !== 'approval pending') {
      return next(new AppError(`${ErrorMessages.STATE.NOT_PENDING_RECHECK}'${blog.status}' status`, 400));
    }

    blog.status = 'recheck';
    blog.rechecked_by = admin_id;
    await blog.save();

    const feedback = await Feedback.create({
      blog_id: blog_id,
      feedback_given_by: admin_id,
      feedback_content: feedback_content
    });

    if (blog.user_id) {
      await NotificationService.trigger({
        io: req.io,
        userId: blog.user_id,
        mainType: 'updates',
        subType: 'recheck',
        metadata: { feedbackContent: feedback_content },
        userEmail: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog has been sent back for changes',
      updated_blog: {
        blog_id: blog.blog_id,
        blog_title: blog.blog_title,
        status: blog.status,
        rechecked_by: blog.rechecked_by
      },
      feedback_details: feedback
    });

  } catch (error) {
    return next(error);
  }
};

exports.approveBlog = async (req, res, next) => {
  const { blog_id } = req.params;
  const admin_id = req.user?.id || req.user?.user_id || req.user?.userId;

  try {
    const blog = await BlogPost.findByPk(blog_id);
    if (!blog) {
      return next(new AppError(ErrorMessages.RESOURCE.BLOG_NOT_FOUND, 404));
    }

    if (blog.status !== 'approval pending') {
      return next(new AppError(`${ErrorMessages.STATE.NOT_PENDING_APPROVE}'${blog.status}' status`, 400));
    }

    blog.status = 'approved'; 
    blog.approved_by = admin_id;
    await blog.save();

    if (blog.user_id) {
      await NotificationService.trigger({
        io: req.io,
        userId: blog.user_id,
        mainType: 'updates',
        subType: 'approved',
        metadata: {},
        userEmail: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog post has been successfully approved.',
      updated_blog: {
        blog_id: blog.blog_id,
        blog_title: blog.blog_title,
        status: blog.status,
        approved_by: blog.approved_by
      }
    });

  } catch (error) {
    return next(error);
  }
};
