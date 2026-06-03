const { Comment, Reaction, BlogPost } = require('../models');
const { v4: uuidv4 } = require('uuid');
const NotificationService = require('../utils/notificationService');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.blogComment = async (req, res, next) => {
  try {
    const { blog_id } = req.params;
    const { comment_content } = req.body;
    const user_id = req.user?.id || req.user?.user_id || req.user?._id || req.user;

    if (!comment_content) {
      return next(new AppError(ErrorMessages.VALIDATION.COMMENT_CONTENT_REQUIRED, 400));
    }

    const newComment = await Comment.create({
      blog_id,
      user_id,
      comment_content,
      parent_comment_id: null
    });

    const blog = await BlogPost.findByPk(blog_id);
    const blog_author_id = blog?.user_id || blog?.author_id;

    if (blog && blog_author_id && String(blog_author_id).trim() !== String(user_id).trim()) {
      await NotificationService.trigger({
        io: req.io,
        userId: blog_author_id,
        mainType: 'messages',
        subType: 'blog comment',
        metadata: { username: req.user?.name || 'A user' },
        userEmail: null
      });
    }
    return res.status(201).json(newComment);
  } 
  catch (error) {
    return next(error);
  }
};

exports.commentReply = async (req, res, next) => {
  try {
    const { comment_id } = req.params; 
    const { comment_content } = req.body;
    const user_id = req.user?.id || req.user?.user_id || req.user?._id || req.user;

    if (!comment_content) {
      return next(new AppError(ErrorMessages.VALIDATION.REPLY_CONTENT_REQUIRED, 400));
    }

    const targetComment = await Comment.findByPk(comment_id);
    if (!targetComment) {
      return next(new AppError(ErrorMessages.RESOURCE.TARGET_COMMENT_NOT_FOUND, 404));
    }

    const parentCommentId = targetComment.parent_comment_id ? targetComment.parent_comment_id : targetComment.comment_id;

    const newReply = await Comment.create({
      blog_id: targetComment.blog_id,
      user_id,
      comment_content,
      parent_comment_id: parentCommentId
    });

    const comment_author_id = targetComment.user_id || targetComment.author_id || targetComment.commenter_id;

    if (targetComment && comment_author_id && String(comment_author_id).trim() !== String(user_id).trim()) {
      await NotificationService.trigger({
        io: req.io,
        userId: comment_author_id,
        mainType: 'messages',
        subType: 'comment reply',
        metadata: { username: req.user?.name || 'Someone' },
        userEmail: null
      });
    }
    return res.status(201).json(newReply);
  } 
  catch (error) {
    return next(error);
  }
};
