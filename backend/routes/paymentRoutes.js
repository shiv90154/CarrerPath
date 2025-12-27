const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getAdminPayments,
    getUserPayments,
    testPaymentSystem
} = require('../controllers/paymentController');
const router = express.Router();

// Test route
router.route('/test').get(protect, testPaymentSystem);

// Public/Student routes
router.route('/orders').post(protect, createRazorpayOrder);
router.route('/verify').post(protect, verifyRazorpayPayment);
router.route('/myorders').get(protect, getUserPayments); // For student dashboard

// Admin routes
router.route('/admin').get(protect, admin, getAdminPayments);

module.exports = router;

