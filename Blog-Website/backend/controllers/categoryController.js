const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await sequelize.query(
      'SELECT category_id, name FROM "Categories" ORDER BY name ASC',
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error('Get All Categories Error:', error);
    res.status(500).json({ success: false, message: "Error fetching categories" });
  }
};

exports.createCategory = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { categories } = req.body;

    if (!Array.isArray(categories)) {
      categories = [req.body]; 
    }

    if (categories.length === 0 || !categories[0].name) {
      return res.status(400).json({ success: false, message: "Please provide category name(s)" });
    }

    const values = categories.map(cat => `('${cat.name}')`).join(',');

    await sequelize.query(
      `INSERT INTO "Categories" (name) VALUES ${values} ON CONFLICT (name) DO NOTHING`,
      { type: QueryTypes.INSERT, transaction: t }
    );

    await t.commit();
    res.status(201).json({ success: true, message: "Category(s) added successfully" });
  } catch (error) {
    await t.rollback();
    console.error('Create Category Error:', error);
    res.status(500).json({ success: false, message: "Error creating category" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await sequelize.query(
      'SELECT category_id, name FROM "Categories" WHERE category_id = :id',
      { replacements: { id }, type: QueryTypes.SELECT, plain: true }
    );

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error('Get Category By ID Error:', error);
    res.status(500).json({ success: false, message: "Error fetching category" });
  }
};

exports.seedCategories = async (req, res) => {
  try {
    const list = ['Technology', 'Programming', 'Wellness', 'Life', 'Society', 'Culture', 'Business'];
    const values = list.map(name => `('${name}')`).join(',');

    await sequelize.query(
      `INSERT INTO "Categories" (name) VALUES ${values} ON CONFLICT (name) DO NOTHING`, 
      { type: QueryTypes.INSERT }
    );

    res.status(201).json({ success: true, message: "Categories seeded" });
  } catch (error) {
    console.error('Seed Error:', error);
    res.status(500).json({ success: false, message: "Seed failed" });
  }
};
