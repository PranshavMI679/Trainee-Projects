const express = require('express');
const router = express.Router();

const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');
const { recheckSchema } = require('../validations/admin.validation');
const { getPendingBlogs, recheckBlog, approveBlog } = require('../controllers/adminController');

router.use(authMiddleware, isAdmin);

router.get('/pending', getPendingBlogs);
router.post('/recheck/:blog_id', validator(recheckSchema), recheckBlog);
router.post('/approve/:blog_id', approveBlog);

module.exports = router;
