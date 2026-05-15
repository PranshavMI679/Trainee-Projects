const {Interest, BlogPost, User, Category} = require('../models/');
const { Op } = require('sequelize');

exports.saveInterests = async (req, res) => {
  const t = await Interest.sequelize.transaction();
  try {
    const userId = req.user.user_id;
    const { categoryNames } = req.body; 

    if (!Array.isArray(categoryNames) || categoryNames.length === 0) {
      return res.status(400).json({ success: false, message: "Please select at least one interest" });
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
      return res.status(404).json({ success: false, message: "None of the provided categories exist" });
    }

    await Interest.upsert({
      user_id: userId,
      category_ids: categoryIds
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ 
      success: true, 
      message: "Interests updated successfully",
      savedCount: categoryIds.length 
    });
  } catch (error) {
    await t.rollback();
    console.error('Save Interests Error:', error);
    res.status(500).json({ success: false, message: "Error saving interests" });
  }
};

exports.forYouFeed = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { categories } = req.query;

    let targetCategoryIds = [];

    if (categories) {
      targetCategoryIds = categories.split(',');
    } else {
      const userInterest = await Interest.findByPk(userId);
      targetCategoryIds = userInterest ? userInterest.category_ids : [];
    }

    const queryOptions = {
      attributes: ['blog_id', 'blog_title', 'content', 'created_at'],
      include: [
        { model: User, attributes: ['name'] },
        { model: Category, attributes: ['category_name'] }
      ],
      order: [['created_at', 'DESC']]
    };

    if (targetCategoryIds.length > 0) {
      queryOptions.where = {
        category_id: { [Op.in]: targetCategoryIds }
      };
    }

    const posts = await BlogPost.findAll(queryOptions);

    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    console.error('Feed Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching feed' });
  }
};
