const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadBlogImage } = require('../middleware/uploadMiddleware');
const validator = require('../middleware/validator');
const { createBlogSchema, editBlogSchema } = require('../validations/write.validation');

const {createBlogPost, editBlog, submitBlogForApproval, getFeedback, publishBlog, getParticularBlog} = require('../controllers/writeController');

router.use(authMiddleware, uploadBlogImage);

router.post('/write', validator(createBlogSchema), createBlogPost);
router.put('/edit/:blog_id', validator(editBlogSchema), editBlog);
router.patch('/draft/:blog_id/submit', submitBlogForApproval);
router.get('/feedback/:blog_id', getFeedback);
router.patch('/:blog_id/publish', publishBlog);
router.get('/:blog_id', getParticularBlog);

module.exports = router;
