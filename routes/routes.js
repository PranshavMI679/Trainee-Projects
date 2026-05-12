const express = require('express');
const router = express.Router();

const {authMiddleware, isAdmin} = require('../middleware/authMiddleware');

const validator = require('../middleware/validator');
const {userSchema} =require('../validations/auth.validation');

const {registerUser, loginUser} = require('../controllers/authController');
const {saveInterests, getFeed} =  require('../controllers/interestController');
const {createCategory} =  require('../controllers/categoryController');
const {followingUser} = require('../controllers/followingController');

//authController.js
router.post('/auth/register', validator(userSchema), registerUser);
router.post('/auth/login', loginUser);

//categoryController.js
router.post('/', authMiddleware, isAdmin, createCategory);

//interestController.js
router.post('/interests/save', authMiddleware, saveInterests)
router.get('/feed', authMiddleware, getFeed);

//followingController.js
router.post('/follow', authMiddleware, followingUser);

module.exports = router;
