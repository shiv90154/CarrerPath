const asyncHandler = require('express-async-handler');
const Notice = require('../models/Notice');
const mongoose = require('mongoose');

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private (Admin)
exports.createNotice = asyncHandler(async (req, res) => {
    try {
        const {
            title,
            description,
            content,
            badge,
            link,
            publishDate,
            expiryDate,
            priority,
            targetAudience,
            category,
            attachments
        } = req.body;

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and description'
            });
        }

        const notice = await Notice.create({
            title,
            description,
            content: content || '',
            badge: badge || 'new',
            link: link || '',
            publishDate: publishDate || Date.now(),
            expiryDate: expiryDate || null,
            priority: priority || 1,
            targetAudience: targetAudience || 'all',
            category: category || 'general',
            attachments: attachments || [],
            author: req.user.id,
            updatedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Notice created successfully',
            data: notice
        });
    } catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private (Admin)
exports.updateNotice = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notice ID'
            });
        }

        // Add updatedBy user
        updates.updatedBy = req.user.id;

        const notice = await Notice.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
        }

        res.json({
            success: true,
            message: 'Notice updated successfully',
            data: notice
        });
    } catch (error) {
        console.error('Update notice error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin)
exports.deleteNotice = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notice ID'
            });
        }

        const notice = await Notice.findByIdAndDelete(id);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
        }

        res.json({
            success: true,
            message: 'Notice deleted successfully'
        });
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Toggle publish status
// @route   PATCH /api/notices/toggle-publish/:id
// @access  Private (Admin)
exports.togglePublishStatus = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notice ID'
            });
        }

        const notice = await Notice.findById(id);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
        }

        notice.isPublished = !notice.isPublished;
        notice.updatedBy = req.user.id;
        await notice.save();

        res.json({
            success: true,
            message: `Notice ${notice.isPublished ? 'published' : 'unpublished'} successfully`,
            data: notice
        });
    } catch (error) {
        console.error('Toggle publish status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get all notices (Admin)
// @route   GET /api/notices/admin/all
// @access  Private (Admin)
exports.getAllNoticesAdmin = asyncHandler(async (req, res) => {
    try {
        // Admin fetching all notices

        const {
            page = 1,
            limit = 20,
            category,
            badge,
            targetAudience,
            search,
            isPublished
        } = req.query;

        // Query params received

        const query = {};

        // Apply filters
        if (category) query.category = category;
        if (badge) query.badge = badge;
        if (targetAudience) query.targetAudience = targetAudience;
        if (isPublished !== undefined && isPublished !== '') {
            query.isPublished = isPublished === 'true';
        }

        // Search in title and description
        if (search && search.trim()) {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        // Query built

        const notices = await Notice.find(query)
            .sort({ priority: -1, publishDate: -1, createdAt: -1 })
            .populate('author', 'name email')
            .populate('updatedBy', 'name email')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Notice.countDocuments(query);

        // Notices fetched successfully

        res.json({
            success: true,
            data: notices,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('❌ Get all notices error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error - ' + error.message,
            error: error.message
        });
    }
});

// @desc    Get published notices (Public)
// @route   GET /api/notices/published
// @access  Public
exports.getPublishedNotices = asyncHandler(async (req, res) => {
    try {
        const {
            limit = 10,
            category,
            targetAudience = 'all'
        } = req.query;

        const query = {
            isPublished: true,
            isActive: true,
            $or: [
                { expiryDate: null },
                { expiryDate: { $gt: new Date() } }
            ]
        };

        // Apply filters
        if (category) query.category = category;
        if (targetAudience !== 'all') {
            query.$and = [
                { $or: [{ targetAudience: 'all' }, { targetAudience }] }
            ];
        }

        const notices = await Notice.find(query)
            .select('-__v -author -updatedBy -updatedAt')
            .sort({ priority: -1, publishDate: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: notices
        });
    } catch (error) {
        console.error('Get published notices error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public
exports.getNoticeById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notice ID'
            });
        }

        const notice = await Notice.findOneAndUpdate(
            { _id: id, isPublished: true, isActive: true },
            { $inc: { views: 1 } },
            { new: true }
        ).select('-__v -author -updatedBy');

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: 'Notice not found or not published'
            });
        }

        res.json({
            success: true,
            data: notice
        });
    } catch (error) {
        console.error('Get notice by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get statistics
// @route   GET /api/notices/admin/stats
// @access  Private (Admin)
exports.getStatistics = asyncHandler(async (req, res) => {
    try {
        // Admin fetching notice statistics

        const total = await Notice.countDocuments();
        const published = await Notice.countDocuments({ isPublished: true });
        const unpublished = total - published;
        const expired = await Notice.countDocuments({
            expiryDate: { $lt: new Date() }
        });

        // Basic stats calculated

        // Category-wise count
        const categoryStats = await Notice.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    published: {
                        $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Badge-wise count
        const badgeStats = await Notice.aggregate([
            {
                $group: {
                    _id: '$badge',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Statistics fetched successfully

        res.json({
            success: true,
            data: {
                total,
                published,
                unpublished,
                expired,
                categoryStats: categoryStats || [],
                badgeStats: badgeStats || []
            }
        });
    } catch (error) {
        console.error('❌ Get statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error - ' + error.message,
            error: error.message
        });
    }
});