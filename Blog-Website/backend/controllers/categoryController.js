const Category = require('../models/category');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.createCategory = async (req, res, next) => {
  const t = await Category.sequelize.transaction();
  try {
    let { categories } = req.body;

    if (!Array.isArray(categories)) {
      categories = [req.body]; 
    }

    if (categories.length === 0 || (!categories[0].name && !categories[0].category_name)) {
      await t.rollback();
      return next(new AppError(ErrorMessages.VALIDATION.CATEGORY_INPUT_REQUIRED, 400));
    }

    const categoryRecords = categories.map(cat => ({
      category_name: cat.name || cat.category_name
    }));

    await Category.bulkCreate(categoryRecords, {
      ignoreDuplicates: true,
      transaction: t
    });

    await t.commit();
    return res.status(201).json({ success: true, message: "Category added successfully" });
  } 
  catch (error) {
    await t.rollback();
    return next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ['category_id', 'category_name'],
      order: [['category_name', 'ASC']]
    });

    if (categories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No categories found",
        categories: []
      });
    }

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } 
  catch (error) {
    return next(error);
  }
};
