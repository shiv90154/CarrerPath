const express = require('express');
const {
    sendOTP,
    resendOTP,
    verifyOTPAndRegister,
    registerUser,
    authUser,
    getAdminProfile,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getOTPForTesting
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// OTP verification routes
router.post('/send-otp', sendOTP);
router.post('/resend-otp', resendOTP);
router.post('/verify-otp', verifyOTPAndRegister);

// Development only - get OTP for testing
router.get('/get-otp/:email', getOTPForTesting);

// Legacy registration (for backward compatibility)
router.route('/register').post(registerUser);
router.post('/login', authUser);

// Profile routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Password change
router.put('/change-password', protect, changePassword);

// Admin routes
router.route('/admin/profile').get(protect, admin, getAdminProfile);

module.exports = router;

