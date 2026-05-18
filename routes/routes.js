const express = require('express');
const router = express.Router();

const {authMiddleware, isAdmin} = require('../middleware/authMiddleware');
const { uploadBlogImage } = require('../middleware/uploadMiddleware');

const validator = require('../middleware/validator');
const {userSchema} =require('../validations/auth.validation');

const {registerUser, loginUser} = require('../controllers/authController');
const {saveInterests, forYouFeed} =  require('../controllers/interestController');
const {createCategory} =  require('../controllers/categoryController');
const {followingUser, featuredFeed} = require('../controllers/followingController');
const {createBlogPost, editBlog, submitBlogForApproval, getFeedback, publishBlog} = require('../controllers/writeController');
const {getPendingBlogs, recheckBlog, approveBlog} =  require('../controllers/adminController');
const {blogReaction} = require('../controllers/reactionController');

//authController.js
router.post('/auth/register', validator(userSchema), registerUser);
router.post('/auth/login', loginUser);

//categoryController.js
router.post('/', authMiddleware, isAdmin, createCategory);

//interestController.js
router.post('/interests/save', authMiddleware, saveInterests);
router.get('/for-you', authMiddleware, forYouFeed);

//followingController.js
router.post('/follow', authMiddleware, followingUser);
router.get('/featured', authMiddleware, featuredFeed);

//writeController.js
router.post('/blog', authMiddleware, uploadBlogImage, createBlogPost);
router.put('/edit/:blog_id', authMiddleware, uploadBlogImage, editBlog);
router.patch('/draft/:blog_id/submit', authMiddleware, submitBlogForApproval);
router.get('/feedback/:blog_id', authMiddleware, getFeedback);
router.patch('/:blog_id/publish', authMiddleware, publishBlog)

//adminController.js
router.get('/pending', authMiddleware, isAdmin, getPendingBlogs);
router.post('/recheck/:blog_id', authMiddleware, isAdmin, recheckBlog);
router.post('/approve/:blog_id', authMiddleware, isAdmin, approveBlog);

//reactionController.js
router.post('/blog/:blog_id/reaction', authMiddleware, blogReaction);

//commentController.js


module.exports = router;