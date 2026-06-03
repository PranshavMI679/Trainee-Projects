const { Interest, BlogPost, User, Category, Comment, Reaction } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.saveInterests = async (req, res, next) => {
  const t = await Interest.sequelize.transaction();
  try {
    const userId = req.user.user_id;
    const { categoryNames } = req.body; 

    if (!Array.isArray(categoryNames) || categoryNames.length === 0) {
      await t.rollback();
      return next(new AppError(ErrorMessages.VALIDATION.INTEREST_SELECTION_REQUIRED, 400));
    }

    const foundCategories = await Category.findAll({
      where: {
        category_name: { [Op.in]: categoryNames }
      },
      attributes: ['category_id'],
      transaction: t
    });

    const categoryIds = foundCategories.map(cat => cat.category_id);

    if (categoryIds.length === 0) {
      await t.rollback();
      return next(new AppError(ErrorMessages.RESOURCE.CATEGORIES_NOT_EXIST, 404));
    }

    await Interest.upsert({
      user_id: userId,
      category_ids: categoryIds
    }, { transaction: t });

    await t.commit();
    return res.status(200).json({ 
      success: true, 
      message: "Interests updated successfully",
      savedCount: categoryIds.length 
    });
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

exports.forYouFeed = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.user_id || req.user?.userId;
    const { categories } = req.query;

    let targetCategoryIds = [];

    if (categories) {
      targetCategoryIds = categories.split(',').map(id => id.trim());
    } else {
      const userInterest = await Interest.findByPk(userId);
      targetCategoryIds = userInterest ? userInterest.category_ids : [];
    }

    const queryOptions = {
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
        'Comments->reactions.reaction_id',
        'Reactions.reaction_id'
      ]
    };

    if (targetCategoryIds.length > 0) {
      queryOptions.where = {
        status: 'published',
        category_id: { [Op.in]: targetCategoryIds }
      };
    } else {
      queryOptions.where = {
        status: 'published'
      };
    }

    const posts = await BlogPost.findAll(queryOptions);

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