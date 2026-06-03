const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');
const { blogCommentSchema, commentReplySchema } = require('../validations/comment.validation');
const { blogComment, commentReply } = require('../controllers/commentController');

router.use(authMiddleware);

router.post('/:blog_id/comment', validator(blogCommentSchema), blogComment);
router.post('/:comment_id/reply', validator(commentReplySchema), commentReply);

module.exports = router;
