const asyncHandler = require('express-async-handler');
const Video = require('../models/Video');
const Course = require('../models/Course');
const Order = require('../models/Order');
const User = require('../models/User');

/* =========================================================
   @desc    Get video access (secure endpoint)
   @route   GET /api/videos/:videoId/access
   @access  Private
========================================================= */
const getVideoAccess = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    // Find the video
    const video = await Video.findById(videoId).populate('course');

    if (!video) {
        res.status(404);
        throw new Error('Video not found');
    }

    if (!video.isActive) {
        res.status(404);
        throw new Error('Video not available');
    }

    const course = video.course;

    // Check if user has purchased the course
    const order = await Order.findOne({
        user: userId,
        itemType: 'course',
        itemId: course._id,
        status: 'approved',
    });

    if (!order) {
        res.status(403);
        throw new Error('Access denied. Course not purchased.');
    }

    // Update video views
    video.views += 1;
    await video.save();

    // Update user progress
    const user = await User.findById(userId);
    const purchasedCourse = user.purchasedCourses.find(
        pc => pc.course.toString() === course._id.toString()
    );

    if (purchasedCourse) {
        // Add to completed videos if not already there
        if (!purchasedCourse.completedVideos.includes(videoId)) {
            purchasedCourse.completedVideos.push(videoId);

            // Calculate progress
            const totalVideos = await Video.countDocuments({
                course: course._id,
                isActive: true
            });
            purchasedCourse.progress = Math.round(
                (purchasedCourse.completedVideos.length / totalVideos) * 100
            );

            await user.save();
        }
    }

    // Return only the YouTube video ID (never the full URL)
    res.json({
        success: true,
        videoId: video.youtubeVideoId,
        title: video.title,
        description: video.description,
        duration: video.duration,
        views: video.views
    });
});

/* =========================================================
   @desc    Get course videos list (for navigation)
   @route   GET /api/courses/:courseId/videos
   @access  Private
========================================================= */
const getCourseVideos = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Check if user has purchased the course
    const order = await Order.findOne({
        user: userId,
        itemType: 'course',
        itemId: courseId,
        status: 'approved',
    });

    if (!order) {
        res.status(403);
        throw new Error('Access denied. Course not purchased.');
    }

    // Get all videos for the course (without YouTube IDs)
    const videos = await Video.find({
        course: courseId,
        isActive: true
    })
        .select('title description duration order views')
        .sort({ order: 1 });

    res.json({
        success: true,
        videos
    });
});

module.exports = {
    getVideoAccess,
    getCourseVideos
};