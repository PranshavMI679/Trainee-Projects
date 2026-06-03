const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const validator = require('../middleware/validator');
const { updateUserProfileSchema } = require('../validations/user.validation');
const { getUserProfile, updateUserProfile, searchFilter, logoutUser } = require('../controllers/userController');

router.use(authMiddleware);

router.get('/:user_id/profile', getUserProfile);
router.patch('/update/:user_id', validator(updateUserProfileSchema), updateUserProfile);
router.get('/search', searchFilter);
router.post('/logout', logoutUser);

module.exports = router;
