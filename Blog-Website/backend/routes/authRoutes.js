const express = require('express');
const router = express.Router();

const validator = require('../middleware/validator');
const { userSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/auth.validation');

const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', validator(userSchema), registerUser);
router.post('/login', validator(loginSchema), loginUser);
router.post('/forgot-password', validator(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', validator(resetPasswordSchema), resetPassword);

module.exports = router;
