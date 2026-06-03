const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');
const { reactionSchema } = require('../validations/reaction.validation');
const { blogReaction, commentReaction } = require('../controllers/reactionController');

router.use(authMiddleware);

router.post('/blog/:blog_id/reaction', validator(reactionSchema), blogReaction);
router.post('/comment/:comment_id/reaction', validator(reactionSchema), commentReaction);

module.exports = router;
