const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getAdminStats,
    getAllUsers,
    getUserDetails,
    updateUserRole,
    updateUserStatus,
    sendEmailToUser,
    bulkUserAction,
    exportUsers,
    deleteUser
} = require('../controllers/adminController');

const router = express.Router();

// Test route to check if admin routes are working
router.get('/test', protect, admin, (req, res) => {
    // Admin test route accessed
    res.json({
        message: 'Admin routes are working!',
        user: {
            id: req.user._id,
            name: req.user.name,
            role: req.user.role
        },
        timestamp: new Date().toISOString()
    });
});

// Simple health check for admin routes
router.get('/health', (req, res) => {
    res.json({
        status: 'Admin routes are healthy',
        timestamp: new Date().toISOString()
    });
});

// All routes are protected and admin only
router.use(protect, admin);

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users/export', exportUsers);
router.post('/users/bulk-action', bulkUserAction);
router.get('/users/:id', getUserDetails);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.post('/users/:id/send-email', sendEmailToUser);
router.delete('/users/:id', deleteUser);

module.exports = router;