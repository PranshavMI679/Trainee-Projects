const { BlogPost, User, Category, Following, Comment, Reaction } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const NotificationService = require('../utils/notificationService');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.followingUser = async (req, res, next) => {
  try {
    const followerId = req.user.user_id; 
    const { user_id: targetUserIdFromParam } = req.params;

    if (String(followerId) === String(targetUserIdFromParam)) {
      return next(new AppError(ErrorMessages.STATE.FOLLOW_SELF_VIOLATION, 400));
    }

    const targetUser = await User.findOne({
      where: { user_id: targetUserIdFromParam },
      attributes: ['user_id', 'name']
    });
    
    if (!targetUser) {
      return next(new AppError(ErrorMessages.RESOURCE.USER_NOT_FOUND, 404));
    }

    const targetUserId = targetUser.user_id;
    const targetUsername = targetUser.name; 

    const [follow, created] = await Following.findOrCreate({
      where: {
        follower_id: followerId,
        user_id: targetUserId
      }
    });
    
    if (!created) {
      return next(new AppError(ErrorMessages.STATE.ALREADY_FOLLOWING, 400));
    }

    await NotificationService.trigger({
      io: req.io,
      userId: followerId,
      mainType: 'messages',
      subType: 'following friend',
      metadata: { username: targetUsername, type: 'self' },
      userEmail: null
    });

    await NotificationService.trigger({
      io: req.io,
      userId: targetUserId,
      mainType: 'messages',
      subType: 'following friend',
      metadata: { username: req.user.name, type: 'other' },
      userEmail: null
    });

    return res.status(201).json({
      success: true,
      message: `You are now following ${targetUsername}`
    });
  } 
  catch (error) {
    return next(error);
  }
};

exports.featuredFeed = async (req, res, next) => {
  try {
    const current_user_id = req.user?.id || req.user?.user_id || req.user?.userId;

    const followingsList = await Following.findAll({
      where: { user_id: current_user_id },
      attributes: ['follower_id']
    });

    const followedAuthorIds = followingsList.map(follow => follow.follower_id);

    if (followedAuthorIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You are not following any authors yet. Your feed is empty.",
        count: 0,
        posts: []
      });
    }

    const posts = await BlogPost.findAll({
      where: {
        status: 'published',
        user_id: { [Op.in]: followedAuthorIds }
      },
      attributes: ['blog_title', 'blog_image', 'content', 'created_at', 'updated_at'],
      include: [
        { model: User, attributes: ['name'] },
        { model: Category, attributes: ['category_name'] },
        {
          model: Reaction,
          attributes: ['reaction_type', [sequelize.fn('COUNT', sequelize.col('Reactions.reaction_id')), 'count']],
          group: ['reaction_type']
        },
        {
          model: Comment,
          attributes: ['comment_id', 'parent_comment_id', 'comment_content', 'created_at'],
          include: [
            { model: User, attributes: ['name'] },
            {
              model: Reaction,
              as: 'reactions',
              attributes: ['reaction_type']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC'], [Comment, 'created_at', 'ASC']],
      group: [
        'BlogPost.blog_id', 'User.user_id', 'Category.category_id', 'Comments.comment_id', 'Comments->User.user_id', 
        'Comments->reactions.reaction_id', 'Reactions.reaction_id'
      ]
    });

    const formattedPosts = posts.map(post => {
      const plainPost = post.get({ plain: true });
      
      const blogReactionsMap = {};
      plainPost.Reactions?.forEach(r => {
        blogReactionsMap[r.reaction_type] = parseInt(r.get ? r.get('count') : r.count) || 0;
      });
      plainPost.blog_reactions = blogReactionsMap;
      delete plainPost.Reactions;

      const rawComments = plainPost.Comments || [];
      delete plainPost.Comments;

      const parentCommentsMap = {};
      const childComments = [];

      rawComments.forEach(comment => {
        const reactionCounts = {};
        comment.reactions?.forEach(r => {
          reactionCounts[r.reaction_type] = (reactionCounts[r.reaction_type] || 0) + 1;
        });
        comment.comment_reactions = reactionCounts;
        delete comment.reactions;

        if (!comment.parent_comment_id) {
          comment.Replies = [];
          parentCommentsMap[comment.comment_id] = comment;
        } else {
          childComments.push(comment);
        }
      });

      childComments.forEach(child => {
        const rootParent = parentCommentsMap[child.parent_comment_id];
        if (rootParent) {
          rootParent.Replies.push(child);
        }
      });

      plainPost.comments = Object.values(parentCommentsMap);
      return plainPost;
    });

    return res.status(200).json({
      success: true,
      count: formattedPosts.length,
      posts: formattedPosts
    });
  } 
  catch (error) {
    return next(error);
  }
};
