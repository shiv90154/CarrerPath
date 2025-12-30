const asyncHandler = require('express-async-handler');
const Video = require('../models/Video');
const Course = require('../models/Course');

/* =========================================================
   @desc    Get all videos (Admin)
   @route   GET /api/admin/videos
   @access  Private/Admin
========================================================= */
const getAllVideos = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized");
    }

    const videos = await Video.find({})
        .populate('course', 'title')
        .sort({ createdAt: -1 });

    res.json(videos);
});

/* =========================================================
   @desc    Create a new video
   @route   POST /api/admin/videos
   @access  Private/Admin
========================================================= */
const createVideo = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized");
    }

    const {
        title,
        description,
        youtubeVideoId,
        duration,
        order,
        courseId,
        isFree,
        isActive
    } = req.body;

    // Validate required fields
    if (!title || !description || !youtubeVideoId || !courseId) {
        res.status(400);
        throw new Error("Title, description, YouTube video ID, and course are required");
    }

    // Validate YouTube video ID format
    if (youtubeVideoId.length !== 11) {
        res.status(400);
        throw new Error("Invalid YouTube video ID. Must be 11 characters long.");
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    // Create video
    const video = new Video({
        title,
        description,
        youtubeVideoId,
        duration: duration || '0:00',
        order: order || 1,
        course: courseId,
        isFree: isFree || false,
        isActive: isActive !== undefined ? isActive : true
    });

    const createdVideo = await video.save();
    await createdVideo.populate('course', 'title');

    res.status(201).json(createdVideo);
});

/* =========================================================
   @desc    Update video
   @route   PUT /api/admin/videos/:id
   @access  Private/Admin
========================================================= */
const updateVideo = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized");
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
        res.status(404);
        throw new Error("Video not found");
    }

    const {
        title,
        description,
        youtubeVideoId,
        duration,
        order,
        courseId,
        isFree,
        isActive
    } = req.body;

    // Validate YouTube video ID format if provided
    if (youtubeVideoId && youtubeVideoId.length !== 11) {
        res.status(400);
        throw new Error("Invalid YouTube video ID. Must be 11 characters long.");
    }

    // Check if course exists if courseId is provided
    if (courseId) {
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404);
            throw new Error("Course not found");
        }
    }

    // Update video fields
    video.title = title || video.title;
    video.description = description || video.description;
    video.youtubeVideoId = youtubeVideoId || video.youtubeVideoId;
    video.duration = duration || video.duration;
    video.order = order !== undefined ? order : video.order;
    video.course = courseId || video.course;
    video.isFree = isFree !== undefined ? isFree : video.isFree;
    video.isActive = isActive !== undefined ? isActive : video.isActive;

    const updatedVideo = await video.save();
    await updatedVideo.populate('course', 'title');

    res.json(updatedVideo);
});

/* =========================================================
   @desc    Delete video
   @route   DELETE /api/admin/videos/:id
   @access  Private/Admin
========================================================= */
const deleteVideo = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized");
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
        res.status(404);
        throw new Error("Video not found");
    }

    await video.deleteOne();
    res.json({ message: "Video deleted successfully" });
});

/* =========================================================
   @desc    Get video by ID (Admin)
   @route   GET /api/admin/videos/:id
   @access  Private/Admin
========================================================= */
const getVideoById = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized");
    }

    const video = await Video.findById(req.params.id)
        .populate('course', 'title');

    if (!video) {
        res.status(404);
        throw new Error("Video not found");
    }

    res.json(video);
});

module.exports = {
    getAllVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    getVideoById
};