const express = require('express');
const router = express.Router();
const emailService = require('../utils/emailService');
const emailNotifications = require('../middleware/emailNotifications');
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');

// @desc    Send announcement to all users
// @route   POST /api/email/announcement
// @access  Private/Admin
router.post('/announcement', protect, admin, async (req, res) => {
    try {
        const { subject, message, targetUsers } = req.body;

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Subject and message are required'
            });
        }

        const result = await emailNotifications.sendAnnouncement(subject, message, targetUsers);

        if (result.success) {
            res.json({
                success: true,
                message: `Announcement sent to ${result.notifiedUsers} users`,
                notifiedUsers: result.notifiedUsers
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send announcement',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Announcement route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Send new course notification to all users
// @route   POST /api/email/new-course
// @access  Private/Admin
router.post('/new-course', protect, admin, async (req, res) => {
    try {
        const { title, description, instructor } = req.body;

        if (!title || !description || !instructor) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and instructor are required'
            });
        }

        const result = await emailNotifications.notifyNewCourse({
            title,
            description,
            instructor
        });

        if (result.success) {
            res.json({
                success: true,
                message: `New course notification sent to ${result.notifiedUsers} users`,
                notifiedUsers: result.notifiedUsers
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send course notification',
                error: result.error
            });
        }
    } catch (error) {
        console.error('New course notification route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Send new test series notification to all users
// @route   POST /api/email/new-test-series
// @access  Private/Admin
router.post('/new-test-series', protect, admin, async (req, res) => {
    try {
        const { title, testCount, duration } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const result = await emailNotifications.notifyNewTestSeries({
            title,
            testCount: testCount || 10,
            duration: duration || 60
        });

        if (result.success) {
            res.json({
                success: true,
                message: `Test series notification sent to ${result.notifiedUsers} users`,
                notifiedUsers: result.notifiedUsers
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test series notification',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Test series notification route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Send welcome email to specific user
// @route   POST /api/email/welcome
// @access  Private/Admin
router.post('/welcome', protect, admin, async (req, res) => {
    try {
        const { userEmail, userName } = req.body;

        if (!userEmail || !userName) {
            return res.status(400).json({
                success: false,
                message: 'User email and name are required'
            });
        }

        const result = await emailService.sendWelcomeEmail(userEmail, userName);

        if (result.success) {
            res.json({
                success: true,
                message: 'Welcome email sent successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send welcome email',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Welcome email route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Send password reset email
// @route   POST /api/email/password-reset
// @access  Public
router.post('/password-reset', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate reset token (you should implement proper token generation)
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const resetUrl = `${process.env.FRONTEND_URL || 'https://carrerpath-m48v.onrender.com'}/reset-password?token=${resetToken}`;

        // Save reset token to user (you should implement this in your User model)
        // user.resetPasswordToken = resetToken;
        // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        // await user.save();

        const result = await emailService.sendPasswordResetEmail(email, user.name, resetUrl);

        if (result.success) {
            res.json({
                success: true,
                message: 'Password reset email sent successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send password reset email',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Password reset email route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Send test completion notification
// @route   POST /api/email/test-completion
// @access  Private
router.post('/test-completion', protect, async (req, res) => {
    try {
        const { testName, score, totalQuestions } = req.body;

        if (!testName || score === undefined || !totalQuestions) {
            return res.status(400).json({
                success: false,
                message: 'Test name, score, and total questions are required'
            });
        }

        const result = await emailService.sendTestCompletionNotification(
            req.user.email,
            req.user.name,
            testName,
            score,
            totalQuestions
        );

        if (result.success) {
            res.json({
                success: true,
                message: 'Test completion notification sent successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test completion notification',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Test completion notification route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get email statistics
// @route   GET /api/email/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isActive: true });
        const totalInactiveUsers = await User.countDocuments({ isActive: false });

        res.json({
            success: true,
            stats: {
                totalActiveUsers: totalUsers,
                totalInactiveUsers: totalInactiveUsers,
                totalUsers: totalUsers + totalInactiveUsers
            }
        });
    } catch (error) {
        console.error('Email stats route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Test email configuration
// @route   POST /api/email/test
// @access  Private/Admin
router.post('/test', protect, admin, async (req, res) => {
    try {
        const { testEmail } = req.body;
        const targetEmail = testEmail || req.user.email;

        const result = await emailService.sendWelcomeEmail(targetEmail, 'Test User');

        if (result.success) {
            res.json({
                success: true,
                message: `Test email sent successfully to ${targetEmail}`
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Test email route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;