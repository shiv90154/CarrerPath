const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const TestSeries = require('../models/TestSeries');
const Ebook = require('../models/Ebook');
const Video = require('../models/Video');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    try {
        // Get basic counts
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments({});
        const totalTestSeries = await TestSeries.countDocuments({});
        const totalEbooks = await Ebook.countDocuments({});

        // Safely get video count with error handling
        let totalVideos = 0;
        try {
            totalVideos = await Video.countDocuments({});
        } catch (videoError) {
            console.warn('Warning: Could not fetch video count:', videoError.message);
            totalVideos = 0;
        }

        // Get orders and revenue
        const orders = await Order.find({ isPaid: true }).lean();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        // Get recent orders with populated data
        const recentOrdersData = await Order.find({ isPaid: true })
            .populate('user', 'name email')
            .populate('course', 'title')
            .populate('testSeries', 'title')
            .populate('ebook', 'title')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const recentOrders = recentOrdersData.map(order => ({
            _id: order._id,
            user: {
                name: order.user?.name || 'Unknown User',
                email: order.user?.email || 'No Email'
            },
            totalPrice: order.totalPrice || 0,
            createdAt: order.createdAt,
            productName: order.course?.title ||
                order.testSeries?.title ||
                order.ebook?.title || 'Unknown Product'
        }));

        // Get recent registrations
        const recentRegistrations = await User.find({ role: 'student' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt')
            .lean();

        const response = {
            totalStudents,
            totalCourses,
            totalTestSeries,
            totalEbooks,
            totalVideos,
            totalOrders,
            totalRevenue,
            recentOrders,
            monthlyRevenue: [],
            recentRegistrations,
            topCourses: []
        };

        res.json(response);
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({
            message: 'Failed to fetch admin statistics',
            error: error.message
        });
    }
});

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            role = '',
            status = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) {
            query.role = role;
        }

        if (status) {
            query.isActive = status === 'active';
        }

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const users = await User.find(query)
            .select('-password')
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await User.countDocuments(query);

        // Get stats for dashboard
        const stats = {
            totalStudents: await User.countDocuments({ role: 'student' }),
            totalAdmins: await User.countDocuments({ role: 'admin' }),
            totalInstructors: await User.countDocuments({ role: 'instructor' }),
            activeUsers: await User.countDocuments({ isActive: { $ne: false } }),
            newUsersThisMonth: await User.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            })
        };

        // Add purchase data to users
        const usersWithPurchases = await Promise.all(users.map(async (user) => {
            const orders = await Order.find({ user: user._id, isPaid: true }).lean();
            const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
            const totalPurchasedCourses = orders.filter(order => order.course).length;

            return {
                ...user,
                totalSpent,
                totalPurchasedCourses
            };
        }));

        res.json({
            users: usersWithPurchases,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
            stats
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// @desc    Get single user details (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get purchase data
        const orders = await Order.find({ user: user._id, isPaid: true }).lean();
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const totalPurchasedCourses = orders.filter(order => order.course).length;

        const userWithPurchases = {
            ...user,
            totalSpent,
            totalPurchasedCourses
        };

        res.json(userWithPurchases);
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({
            message: 'Failed to fetch user details',
            error: error.message
        });
    }
});

// @desc    Update user status (Admin only)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
    try {
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            message: 'Failed to update user status',
            error: error.message
        });
    }
});

// @desc    Send email to user (Admin only)
// @route   POST /api/admin/users/:id/send-email
// @access  Private/Admin
const sendEmailToUser = asyncHandler(async (req, res) => {
    try {
        const { type } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let subject, htmlContent;

        switch (type) {
            case 'welcome':
                subject = 'Welcome to EduTech Institute!';
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">EduTech Institute</h1>
                        </div>
                        <div style="padding: 30px; background-color: #f9f9f9;">
                            <h2 style="color: #333;">Welcome ${user.name}!</h2>
                            <p style="color: #666; font-size: 16px;">
                                We're excited to have you as part of our learning community. 
                                Start exploring our courses and begin your educational journey today!
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:5173/courses" 
                                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                    Explore Courses
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'verification':
                subject = 'Please Verify Your Email - EduTech Institute';
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">EduTech Institute</h1>
                        </div>
                        <div style="padding: 30px; background-color: #f9f9f9;">
                            <h2 style="color: #333;">Email Verification Required</h2>
                            <p style="color: #666; font-size: 16px;">
                                Hi ${user.name}, please verify your email address to access all features of your account.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:5173/verify-email" 
                                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                    Verify Email
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                break;
            default:
                return res.status(400).json({ message: 'Invalid email type' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Send email error:', error);
        res.status(500).json({
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// @desc    Bulk actions on users (Admin only)
// @route   POST /api/admin/users/bulk-action
// @access  Private/Admin
const bulkUserAction = asyncHandler(async (req, res) => {
    try {
        const { action, userIds } = req.body;

        if (!action || !userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        let updateQuery = {};
        let message = '';

        switch (action) {
            case 'activate':
                updateQuery = { isActive: true };
                message = 'Users activated successfully';
                break;
            case 'deactivate':
                updateQuery = { isActive: false };
                message = 'Users deactivated successfully';
                break;
            case 'delete':
                // Don't allow deleting admin users
                await User.deleteMany({
                    _id: { $in: userIds },
                    role: { $ne: 'admin' }
                });
                return res.json({ message: 'Users deleted successfully' });
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }

        const result = await User.updateMany(
            { _id: { $in: userIds } },
            updateQuery
        );

        res.json({
            message,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Bulk action error:', error);
        res.status(500).json({
            message: 'Failed to perform bulk action',
            error: error.message
        });
    }
});

// @desc    Export users data (Admin only)
// @route   GET /api/admin/users/export
// @access  Private/Admin
const exportUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .lean();

        // Create CSV content
        const csvHeader = 'Name,Email,Phone,Role,Status,Joined Date,Last Login,Email Verified,Phone Verified\n';
        const csvContent = users.map(user => {
            return [
                user.name || '',
                user.email || '',
                user.phone || '',
                user.role || '',
                user.isActive !== false ? 'Active' : 'Inactive',
                new Date(user.createdAt).toLocaleDateString(),
                user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
                user.emailVerified ? 'Yes' : 'No',
                user.phoneVerified ? 'Yes' : 'No'
            ].join(',');
        }).join('\n');

        const csv = csvHeader + csvContent;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export users error:', error);
        res.status(500).json({
            message: 'Failed to export users',
            error: error.message
        });
    }
});

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
    try {
        const { role } = req.body;

        if (!['student', 'admin', 'instructor'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({
            message: 'User role updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            message: 'Failed to update user role',
            error: error.message
        });
    }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't allow deleting admin users
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            message: 'Failed to delete user',
            error: error.message
        });
    }
});

module.exports = {
    getAdminStats,
    getAllUsers,
    getUserDetails,
    updateUserRole,
    updateUserStatus,
    sendEmailToUser,
    bulkUserAction,
    exportUsers,
    deleteUser,
};