const express = require('express');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('../middleware/auth');
const { loginLimiter, refreshLimiter } = require('../middleware/rateLimit');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(cookieParser());

// Routes
router.post('/signup', loginLimiter, authController.signup);
router.post('/login', loginLimiter, authController.login);
router.post('/google', loginLimiter, authController.googleAuth);
router.post('/verify-otp', loginLimiter, authController.verifyOTP);
router.post('/resend-otp', loginLimiter, authController.resendOTP);
router.post('/refresh', refreshLimiter, authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);
router.get('/profile', authenticateToken, authController.profile);



router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


module.exports = router;
