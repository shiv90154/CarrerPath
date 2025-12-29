const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createManualOrder,
    uploadPaymentScreenshot,
    getPendingPayments,
    approvePayment,
    rejectPayment,
    getUserOrders,
    getAllOrders
} = require('../controllers/paymentController');
const router = express.Router();

// Student routes
router.route('/create-order').post(protect, createManualOrder);
router.route('/upload-screenshot/:orderId').post(protect, uploadPaymentScreenshot);
router.route('/my-orders').get(protect, getUserOrders);

// Admin routes
router.route('/admin/pending').get(protect, admin, getPendingPayments);
router.route('/admin/all').get(protect, admin, getAllOrders);
router.route('/admin/approve/:orderId').put(protect, admin, approvePayment);
router.route('/admin/reject/:orderId').put(protect, admin, rejectPayment);

module.exports = router;

