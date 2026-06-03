const { User, BlogPost, Comment, Reaction, Category } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const NotificationService = require('../utils/notificationService');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.getUserProfile = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const userProfile = await User.findByPk(user_id, {
      attributes: ['user_id', 'name', 'email', 'role', 'created_at'], 
      include: [
        {
          model: BlogPost,
          include: [
            {
              model: Category,
              attributes: ['category_name']
            },
            {
              model: Reaction,
              where: { comment_id: null },
              required: false,
              attributes: ['reaction_type']
            },
            {
              model: Comment,
              where: { parent_comment_id: null },
              required: false,
              include: [
                {
                  model: User,
                  attributes: ['name']
                },
                {
                  model: Reaction,
                  as: 'reactions',
                  attributes: ['reaction_type']
                },
                {
                  model: Comment,
                  as: 'Replies',
                  required: false,
                  include: [
                    {
                      model: User,
                      attributes: ['name']
                    },
                    {
                      model: Reaction,
                      as: 'reactions',
                      attributes: ['reaction_type']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!userProfile) {
      return next(new AppError(ErrorMessages.RESOURCE.PROFILE_NOT_FOUND, 404));
    }

    const formatReactions = (reactionsArray) => {
      if (!reactionsArray || reactionsArray.length === 0) return {};
      return reactionsArray.reduce((acc, curr) => {
        acc[curr.reaction_type] = (acc[curr.reaction_type] || 0) + 1;
        return acc;
      }, {});
    };

    const rawBlogPosts = userProfile.BlogPosts || [];
    const publishedPosts = [];
    const otherPosts = [];

    rawBlogPosts.forEach(post => {
      if (post.status === 'published') {
        const formattedComments = (post.Comments || []).map(comment => {
          const formattedReplies = (comment.Replies || []).map(reply => ({
            comment_id: reply.comment_id,
            parent_comment_id: reply.parent_comment_id,
            comment_content: reply.comment_content,
            created_at: reply.created_at,
            User: {
              name: reply.User ? reply.User.name : null
            },
            comment_reactions: formatReactions(reply.reactions)
          }));

          return {
            comment_id: comment.comment_id,
            parent_comment_id: comment.parent_comment_id,
            comment_content: comment.comment_content,
            created_at: comment.created_at,
            User: {
              name: comment.User ? comment.User.name : null
            },
            comment_reactions: formatReactions(comment.reactions),
            Replies: formattedReplies
          };
        });

        publishedPosts.push({
          blog_title: post.blog_title,
          blog_image: post.blog_image,
          content: post.content,
          status: post.status,
          created_at: post.created_at,
          updated_at: post.updated_at,
          User: {
            name: userProfile.name
          },
          Category: {
            category_name: post.Category ? post.Category.category_name : null
          },
          blog_reactions: formatReactions(post.Reactions),
          comments: formattedComments
        });
      } else {
        otherPosts.push({
          blog_title: post.blog_title,
          blog_image: post.blog_image,
          content: post.content,
          status: post.status,
          created_at: post.created_at,
          updated_at: post.updated_at,
          User: {
            name: userProfile.name
          },
          Category: {
            category_name: post.Category ? post.Category.category_name : null
          },
          blog_reactions: {},
          comments: []
        });
      }
    });

    const combinedBlogs = [...publishedPosts, ...otherPosts];

    return res.status(200).json({
      success: true,
      user_details: {
        user_id: userProfile.user_id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        created_at: userProfile.created_at
      },
      my_blogs: combinedBlogs
    });
  } 
  catch (error) {
    return next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const actorId = req.user.user_id || req.user.id; 
    const actorRole = req.user.role;       
    const { user_id } = req.params;        
    const { name, email, oldPassword, newPassword, role } = req.body;

    if (actorRole !== 'admin' && actorId !== user_id) {
      return next(new AppError(ErrorMessages.AUTH.OTHER_PROFILE_VIOLATION, 403));
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return next(new AppError(ErrorMessages.RESOURCE.TARGET_PROFILE_NOT_FOUND, 404));
    }

    if (newPassword) {
      const isAdminModifyingOthers = (actorRole === 'admin' && actorId !== user_id);

      if (!isAdminModifyingOthers) {
        if (!oldPassword) {
          return next(new AppError(ErrorMessages.VALIDATION.PASSWORD_REQUIRED, 400));
        }
        
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
          return next(new AppError(ErrorMessages.VALIDATION.PASSWORD_INCORRECT, 401));
        }
      }

      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(newPassword, salt);
    }

    if (name) user.name = name;
    
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return next(new AppError(ErrorMessages.VALIDATION.EMAIL_EXISTS, 400));
      }
      user.email = email;
    }

    if (role) {
      if (actorRole === 'admin') {
        if (!['user', 'admin'].includes(role)) {
          return next(new AppError(ErrorMessages.VALIDATION.INVALID_ROLE, 400));
        }
        user.role = role;
      } else {
        return next(new AppError(ErrorMessages.AUTH.ROLE_VIOLATION, 403));
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile has been updated successfully.',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } 
  catch (error) {
    return next(error);
  }
};

/*
- /search?q=any-keyword (for blogs)
- /search?category=any-category (blogs based on category)
- /search?q=user-name (user-profile and published blogs)
- /search?q=any-keyword&category=any-category (combined filter)
*/
exports.searchFilter = async (req, res, next) => {
  try {
    const { q, category } = req.query;

    const whereConditions = {
      status: 'published'
    };

    if (q) {
      const searchTerms = `%${q}%`;
      whereConditions[Op.or] = [
        { blog_title: { [Op.iLike]: searchTerms } },
        { '$User.name$': { [Op.iLike]: searchTerms } }
      ];
    }

    if (category) {
      whereConditions['$Category.category_name$'] = { [Op.iLike]: category };
    }

    const blogs = await BlogPost.findAll({
      where: whereConditions,
      include: [
        { 
          model: User, 
          attributes: ['name'], 
          required: false 
        },
        { 
          model: Category, 
          attributes: ['category_name'], 
          required: !!category
        },
        { 
          model: Reaction, 
          where: { comment_id: null }, 
          required: false, 
          attributes: ['reaction_type'] 
        },
        { 
          model: Comment, 
          where: { parent_comment_id: null },
          required: false, 
          include: [
            { model: User, attributes: ['name'] },
            { model: Reaction, as: 'reactions', attributes: ['reaction_type'] },
            {
              model: Comment,
              as: 'Replies', 
              required: false,
              include: [
                { model: User, attributes: ['name'] },
                { model: Reaction, as: 'reactions', attributes: ['reaction_type'] }
              ]
            }
          ]
        }
      ]
    });

    const formatReactions = (reactionsArray) => {
      if (!reactionsArray || reactionsArray.length === 0) return {};
      return reactionsArray.reduce((acc, curr) => {
        acc[curr.reaction_type] = (acc[curr.reaction_type] || 0) + 1;
        return acc;
      }, {});
    };

    const formattedBlogs = blogs.map(post => {
      const formattedComments = (post.Comments || []).map(comment => {
        const formattedReplies = (comment.Replies || []).map(reply => ({
          User: { name: reply.User ? reply.User.name : null },
          comment_id: reply.comment_id,
          parent_comment_id: reply.parent_comment_id,
          comment_content: reply.comment_content,
          created_at: reply.created_at,
          comment_reactions: formatReactions(reply.reactions)
        }));

        return {
          User: { name: comment.User ? comment.User.name : null },
          comment_id: comment.comment_id,
          parent_comment_id: comment.parent_comment_id,
          comment_content: comment.comment_content,
          created_at: comment.created_at,
          comment_reactions: formatReactions(comment.reactions),
          Replies: formattedReplies
        };
      });

      return {
        User: { name: post.User ? post.User.name : null },
        Category: { category_name: post.Category ? post.Category.category_name : null },
        blog_id: post.blog_id,
        blog_title: post.blog_title,
        blog_image: post.blog_image,
        content: post.content,
        created_at: post.created_at,
        blog_reactions: formatReactions(post.Reactions),
        comments: formattedComments
      };
    });

    return res.status(200).json({ 
      success: true, 
      count: formattedBlogs.length, 
      posts: formattedBlogs 
    });

  } catch (error) {
    return next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const username = req.user.name;

    await NotificationService.trigger({
      io: req.io,
      userId: userId,
      mainType: 'messages',
      subType: 'logged out',
      metadata: { username: username },
      userEmail: null
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    return next(error);
  }
};
