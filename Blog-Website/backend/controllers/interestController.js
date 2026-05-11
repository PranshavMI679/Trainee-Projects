const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { categories } = req.query;

    let categoryIds;

    if (categories) {
      categoryIds = categories.split(',');
    } else {
      const interests = await sequelize.query(
        'SELECT category_id FROM "Interests" WHERE user_id = :userId',
        { replacements: { userId }, type: QueryTypes.SELECT }
      );
      categoryIds = interests.map(i => i.category_id);
    }

    const whereClause = categoryIds.length > 0 
      ? 'WHERE p.category_id IN (:categoryIds)' 
      : '';

    const posts = await sequelize.query(
      `SELECT p.*, u.name as author_name, c.name as category_name
       FROM "BlogPosts" p
       JOIN "Users" u ON p.author_id = u.user_id
       JOIN "Categories" c ON p.category_id = c.category_id
       ${whereClause}
       ORDER BY p.created_at DESC`,
      { 
        replacements: { categoryIds }, 
        type: QueryTypes.SELECT 
      }
    );

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feed' });
  }
};

exports.getFilterCategories = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const categories = await sequelize.query(
      `SELECT c.*, 
       CASE WHEN ui.user_id IS NOT NULL THEN TRUE ELSE FALSE END as is_premarked
       FROM "Categories" c
       LEFT JOIN "Interests" ui ON c.category_id = ui.category_id AND ui.user_id = :userId`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};
