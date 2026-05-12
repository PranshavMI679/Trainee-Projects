const Category = require('../models/category');

exports.createCategory = async (req, res) => {
  const t = await Category.sequelize.transaction();
  try {
    let { categories } = req.body;

    if (!Array.isArray(categories)) {
      categories = [req.body]; 
    }

    if (categories.length === 0 || (!categories[0].name && !categories[0].category_name)) {
      return res.status(400).json({ success: false, message: "Please provide category name(s)" });
    }

    const categoryRecords = categories.map(cat => ({
      category_name: cat.name || cat.category_name
    }));

    await Category.bulkCreate(categoryRecords, {
      ignoreDuplicates: true,
      transaction: t
    });

    await t.commit();
    res.status(201).json({ success: true, message: "Category(s) added successfully" });
  } 
  catch (error) {
    await t.rollback();
    console.error('Create Category Error:', error);
    res.status(500).json({ success: false, message: "Error creating category" });
  }
};
