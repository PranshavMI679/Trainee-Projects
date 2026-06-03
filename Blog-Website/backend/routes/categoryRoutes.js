const express = require('express');
const router = express.Router();

const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');
const { categorySchema } = require('../validations/category.validation');
const { createCategory, getAllCategories } = require('../controllers/categoryController');

router.use(authMiddleware, isAdmin);

router.post('/create', validator(categorySchema), createCategory); 
router.get('/getAll', getAllCategories);

module.exports = router;
