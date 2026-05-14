const express = require('express');
const router = express.Router();

const {authMiddleware, isAdmin} = require('../middleware/authMiddleware');
const { uploadBlogImage } = require('../middleware/uploadMiddleware');

const validator = require('../middleware/validator');
const {userSchema} =require('../validations/auth.validation');

const {registerUser, loginUser} = require('../controllers/authController');
const {saveInterests, getFeed} =  require('../controllers/interestController');
const {createCategory} =  require('../controllers/categoryController');
const {followingUser} = require('../controllers/followingController');
const {createBlogPost, editBlogDraft, submitBlogForApproval} = require('../controllers/writeController');

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

//writeController.js
router.post('/blog', authMiddleware, uploadBlogImage, createBlogPost);
router.put('/draft/:blog_id/edit', authMiddleware, uploadBlogImage, editBlogDraft);
router.patch('/draft/:blog_id/submit', authMiddleware, submitBlogForApproval);

//adminController.js


module.exports = router;