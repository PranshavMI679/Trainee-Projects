const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');

const {userSchema} =require('../validations/auth.validation');

const {registerUser, loginUser} = require('../controllers/authController');

//authController.js
router.post('/auth/register', validator(userSchema), registerUser);
router.post('/auth/login', loginUser);

//interestController.js
router.get('/', authMiddleware, feedController.getFeed);
router.get('/categories', authMiddleware, feedController.getFilterCategories);

module.exports = router;
