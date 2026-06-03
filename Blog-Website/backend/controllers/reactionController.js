const { Reaction, BlogPost, Comment } = require('../models');
const { v4: uuidv4 } = require('uuid');
const NotificationService = require('../utils/notificationService');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

const ALLOWED_REACTIONS = ['heart', 'thumbs_up', 'smile', 'clap', 'party'];

exports.blogReaction = async (req, res, next) => {
  const { blog_id } = req.params;
  const { reaction_type } = req.body;
  const user_id = req.user?.id || req.user?.user_id || req.user?._id || req.user;

  if (!reaction_type) {
    return next(new AppError(ErrorMessages.VALIDATION.REACTION_TYPE_REQUIRED, 400));
  }

  if (!ALLOWED_REACTIONS.includes(reaction_type)) {
    return next(new AppError(`${ErrorMessages.STATE.INVALID_REACTION_TYPE}${ALLOWED_REACTIONS.join(', ')}.`, 400));
  }

  try {
    const blog = await BlogPost.findByPk(blog_id);
    if (!blog) {
      return next(new AppError(ErrorMessages.RESOURCE.BLOG_NOT_FOUND_DOT, 404));
    }

    if (blog.status !== 'published') {
      return next(new AppError(ErrorMessages.STATE.BLOG_NOT_PUBLISHED, 403));
    }

    const existingReaction = await Reaction.findOne({
      where: { 
        blog_id, 
        user_id,
        comment_id: null 
      }
    });

    if (existingReaction) {
      if (existingReaction.reaction_type === reaction_type) {
        await existingReaction.destroy();
        return res.status(200).json({ 
          success: true, 
          action: 'removed', 
          message: 'Reaction removed successfully.' 
        });
      }

      existingReaction.reaction_type = reaction_type;
      await existingReaction.save();
      return res.status(200).json({ 
        success: true, 
        action: 'updated', 
        message: 'Reaction updated successfully.',
        data: existingReaction 
      });
    }

    const newReaction = await Reaction.create({
      blog_id,
      user_id,
      reaction_type,
      comment_id: null
    });

    if (blog.user_id && blog.user_id !== user_id) {
      await NotificationService.trigger({
        io: req.io,
        userId: blog.user_id,
        mainType: 'messages',
        subType: 'blog reaction',
        metadata: { username: req.user?.name || 'A user', reactionType: reaction_type },
        userEmail: null
      });
    }

    return res.status(201).json({ 
      success: true, 
      action: 'added', 
      message: 'Reaction added successfully.',
      data: newReaction 
    });
  } 
  catch (error) {
    return next(error);
  }
};

exports.commentReaction = async (req, res, next) => {
  const { comment_id } = req.params;
  const { reaction_type } = req.body;
  const user_id = req.user?.id || req.user?.user_id || req.user?._id || req.user;

  if (!reaction_type) {
    return next(new AppError(ErrorMessages.VALIDATION.REACTION_TYPE_REQUIRED, 400));
  }

  if (!ALLOWED_REACTIONS.includes(reaction_type)) {
    return next(new AppError(`${ErrorMessages.STATE.INVALID_REACTION_TYPE}${ALLOWED_REACTIONS.join(', ')}.`, 400));
  }

  try {
    const comment = await Comment.findByPk(comment_id);
    if (!comment) {
      return next(new AppError(ErrorMessages.RESOURCE.COMMENT_NOT_FOUND, 404));
    }

    const existingReaction = await Reaction.findOne({
      where: {
        blog_id: comment.blog_id,
        comment_id,
        user_id
      }
    });

    if (existingReaction) {
      if (existingReaction.reaction_type === reaction_type) {
        await existingReaction.destroy();
        return res.status(200).json({
          success: true,
          action: 'removed',
          message: 'Reaction removed from comment successfully.'
        });
      }

      existingReaction.reaction_type = reaction_type;
      await existingReaction.save();
      return res.status(200).json({
        success: true,
        action: 'updated',
        message: 'Comment reaction updated successfully.',
        data: existingReaction
      });
    }

    const newReaction = await Reaction.create({
      blog_id: comment.blog_id,
      comment_id,
      user_id,
      reaction_type
    });

    if (comment.user_id && comment.user_id !== user_id) {
      await NotificationService.trigger({
        io: req.io,
        userId: comment.user_id,
        mainType: 'messages',
        subType: 'comment reaction',
        metadata: { username: req.user?.name || 'Someone', reactionType: reaction_type },
        userEmail: null
      });
    }

    return res.status(201).json({
      success: true,
      action: 'added',
      message: 'Reaction added to comment successfully.',
      data: newReaction
    });
  } 
  catch (error) {
    return next(error);
  }
};
