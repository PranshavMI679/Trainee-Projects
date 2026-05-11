const express = require('express');
const router = express.Router();

const {authMiddleware, isAdmin} = require('../middleware/authMiddleware');

const validator = require('../middleware/validator');
const {userSchema} =require('../validations/auth.validation');

const {registerUser, loginUser} = require('../controllers/authController');
const {saveInterests, getFeed, getFilterCategories} =  require('../controllers/interestController');
const {getAllCategories, getCategoryById, seedCategories, createCategory} =  require('../controllers/categoryController');

//authController.js
router.post('/auth/register', validator(userSchema), registerUser);
router.post('/auth/login', loginUser);

//categoryController.js
router.get('/', authMiddleware, getAllCategories);
router.get('/:id', authMiddleware, getCategoryById);
router.post('/seed', authMiddleware, isAdmin, seedCategories);
router.post('/', authMiddleware, isAdmin, createCategory);

//interestController.js
router.post('/interests/save', authMiddleware, saveInterests)
router.get('/feed', authMiddleware, getFeed);
router.get('/filterFeed', authMiddleware, getFilterCategories);

module.exports = router;
