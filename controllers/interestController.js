const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.saveInterests = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.user_id;
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ success: false, message: "Please select at least one interest" });
    }

    await sequelize.query(
      'DELETE FROM "Interests" WHERE user_id = :userId',
      { replacements: { userId }, type: QueryTypes.DELETE, transaction: t }
    );

    const values = categoryIds.map(id => `('${userId}', '${id}')`).join(',');
    await sequelize.query(
      `INSERT INTO "Interests" (user_id, category_id) VALUES ${values}`,
      { type: QueryTypes.INSERT, transaction: t }
    );

    await t.commit();
    res.status(200).json({ success: true, message: "Interests saved successfully" });
  } catch (error) {
    await t.rollback();
    console.error('Save Interests Error:', error);
    res.status(500).json({ success: false, message: "Error saving interests" });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { categories } = req.query;

    let categoryIds = [];

    if (categories) {
      categoryIds = categories.split(',');
    } else {
      const interests = await sequelize.query(
        'SELECT category_id FROM "Interests" WHERE user_id = :userId',
        { replacements: { userId }, type: QueryTypes.SELECT }
      );
      categoryIds = interests.map(i => i.category_id);
    }

    const hasFilters = categoryIds.length > 0;
    const whereClause = hasFilters ? 'WHERE p.category_id IN (:categoryIds)' : '';

    const posts = await sequelize.query(
      `SELECT p.post_id, p.title, p.content, p.created_at, 
              u.name as author_name, c.name as category_name
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

    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    console.error('Feed Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching feed' });
  }
};

/*
exports.getFilterCategories = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const categories = await sequelize.query(
      `SELECT c.category_id, c.name, 
       CASE WHEN i.user_id IS NOT NULL THEN TRUE ELSE FALSE END as is_premarked
       FROM "Categories" c
       LEFT JOIN "Interests" i ON c.category_id = i.category_id AND i.user_id = :userId
       ORDER BY c.name ASC`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );

    res.json({ success: true, categories });
  } catch (error) {
    console.error('Category List Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
};
*/
