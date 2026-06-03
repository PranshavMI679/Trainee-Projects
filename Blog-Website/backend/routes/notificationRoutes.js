const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const { getUserNotifications } = require('../controllers/notificationController');

router.use(authMiddleware);

router.get('/notifications', getUserNotifications);

module.exports = router;
