const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const { followingUser, featuredFeed } = require('../controllers/followingController');

router.use(authMiddleware);

router.post('/:user_id', followingUser);
router.get('/featured', featuredFeed);

module.exports = router;