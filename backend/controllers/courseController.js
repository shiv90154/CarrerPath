const asyncHandler = require("express-async-handler");
const fs = require("fs");

const Course = require("../models/Course");
const Video = require("../models/Video");
const Order = require("../models/Order");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");

/* =========================================================
   @desc    Create a new course
   @route   POST /api/courses
   @access  Private/Admin
========================================================= */
const createCourse = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const {
    title,
    description,
    fullDescription,
    price,
    originalPrice,
    image,
    category,
    level,
    duration,
    language,
    tags,
    requirements,
    whatYouWillLearn,
    content // New hierarchical content structure
  } = req.body;

  if (!title || !price || !category || !fullDescription) {
    res.status(400);
    throw new Error("Title, price, category and full description are required");
  }

  const course = new Course({
    title,
    description,
    fullDescription,
    price,
    originalPrice: originalPrice || price,
    image: image || "/images/sample.jpg",
    category,
    level: level || 'Beginner',
    duration,
    language: language || 'English',
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    requirements: requirements ? requirements.split(',').map(req => req.trim()) : [],
    whatYouWillLearn: whatYouWillLearn ? whatYouWillLearn.split(',').map(item => item.trim()) : [],
    content: content || [], // Initialize with hierarchical content structure
    instructor: req.user._id,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

/* =========================================================
   @desc    Get all courses (Admin)
   @route   GET /api/courses/admin
   @access  Private/Admin
========================================================= */
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({})
    .populate("instructor", "name email")
    .populate("videos")
    .sort({ createdAt: -1 });

  res.json(courses);
});

/* =========================================================
   @desc    Get course by ID (Admin)
   @route   GET /api/courses/admin/:id
   @access  Private/Admin
========================================================= */
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name email")
    .populate({
      path: "videos",
      options: { sort: { order: 1 } }
    });

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.json(course);
});

/* =========================================================
   @desc    Update course
   @route   PUT /api/courses/:id
   @access  Private/Admin
========================================================= */
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const {
    title,
    description,
    fullDescription,
    price,
    originalPrice,
    image,
    category,
    level,
    duration,
    language,
    tags,
    requirements,
    whatYouWillLearn,
    content, // New hierarchical content structure
    isActive,
    isFeatured
  } = req.body;

  course.title = title || course.title;
  course.description = description || course.description;
  course.fullDescription = fullDescription || course.fullDescription;
  course.price = price !== undefined ? price : course.price;
  course.originalPrice = originalPrice !== undefined ? originalPrice : course.originalPrice;
  course.image = image || course.image;
  course.category = category || course.category;
  course.level = level || course.level;
  course.duration = duration || course.duration;
  course.language = language || course.language;
  course.tags = tags ? tags.split(',').map(tag => tag.trim()) : course.tags;
  course.requirements = requirements ? requirements.split(',').map(req => req.trim()) : course.requirements;
  course.whatYouWillLearn = whatYouWillLearn ? whatYouWillLearn.split(',').map(item => item.trim()) : course.whatYouWillLearn;
  course.isActive = isActive !== undefined ? isActive : course.isActive;
  course.isFeatured = isFeatured !== undefined ? isFeatured : course.isFeatured;

  // Update hierarchical content structure if provided
  if (content) {
    course.content = content;
  }

  const updatedCourse = await course.save();
  res.json(updatedCourse);
});

/* =========================================================
   @desc    Delete course
   @route   DELETE /api/courses/:id
   @access  Private/Admin
========================================================= */
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Delete all videos associated with this course
  await Video.deleteMany({ course: course._id });

  await course.deleteOne();
  res.json({ message: "Course and associated videos deleted successfully" });
});

/* =========================================================
   @desc    Upload video to course
   @route   POST /api/courses/:id/videos
   @access  Private/Admin
========================================================= */
const uploadVideo = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const { title, description, duration, order, isFree, isPreview } = req.body;
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No video file uploaded");
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: `institute-website/courses/${course._id}/videos`,
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    // Clean up temp file asynchronously
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    // Create video document
    const video = new Video({
      title,
      description,
      videoUrl: result.secure_url,
      thumbnailUrl: result.secure_url.replace(/\.[^/.]+$/, ".jpg"), // Generate thumbnail URL
      duration: duration || '0:00',
      order: order || 1,
      isFree: isFree === "true" || isFree === true,
      isPreview: isPreview === "true" || isPreview === true,
      course: courseId,
    });

    const createdVideo = await video.save();

    // Add video to course
    course.videos.push(createdVideo._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: createdVideo
    });

  } catch (error) {
    // Clean up temp file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file on error:', err);
      });
    }

    console.error('Video upload error:', error);
    res.status(500);
    throw new Error("Failed to upload video: " + error.message);
  }
});

/* =========================================================
   @desc    Get all courses (Public)
   @route   GET /api/courses
   @access  Public
========================================================= */
const getAllCoursesPublic = asyncHandler(async (req, res) => {
  const { category, level, search, sort, limit = 12, page = 1 } = req.query;

  let query = { isActive: true };

  // Add filters
  if (category) query.category = category;
  if (level) query.level = level;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Sort options
  let sortOption = { createdAt: -1 };
  if (sort === 'price_low') sortOption = { price: 1 };
  if (sort === 'price_high') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'popular') sortOption = { enrolledStudents: -1 };

  const courses = await Course.find(query)
    .populate("instructor", "name")
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Course.countDocuments(query);

  res.json({
    courses,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

/* =========================================================
   @desc    Get course by ID (Public with content lock)
   @route   GET /api/courses/:id
   @access  Public / Optional Auth
========================================================= */
const getCourseByIdPublic = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name bio avatar")
    .populate({
      path: "videos",
      options: { sort: { order: 1 } }
    })
    .populate({
      path: "content.subcategories.videos",
      model: "Video",
      options: { sort: { order: 1 } }
    })
    .populate({
      path: "content.videos",
      model: "Video",
      options: { sort: { order: 1 } }
    });

  if (!course || !course.isActive) {
    res.status(404);
    throw new Error("Course not found");
  }

  const user = req.user || null;
  let hasPurchased = false;

  // Check if user has purchased the course
  if (user) {
    const order = await Order.findOne({
      user: user._id,
      course: course._id,
      isPaid: true,
    });

    if (order) {
      hasPurchased = true;
      // Update user's purchased courses if not already there
      const userDoc = await User.findById(user._id);
      const existingPurchase = userDoc.purchasedCourses.find(
        pc => pc.course.toString() === course._id.toString()
      );

      if (!existingPurchase) {
        userDoc.purchasedCourses.push({
          course: course._id,
          purchaseDate: order.createdAt,
          progress: 0,
          completedVideos: []
        });
        await userDoc.save();
      }
    }
  }

  if (hasPurchased) {
    return res.json({
      ...course.toObject(),
      hasPurchased: true,
      accessType: 'full'
    });
  }

  // Filter content based on access for non-purchasers
  const filteredContent = course.content
    .filter(category => category) // Filter out null categories
    .map(category => ({
      ...category.toObject(),
      subcategories: category.subcategories
        .filter(subcategory => subcategory) // Filter out null subcategories
        .map(subcategory => ({
          ...subcategory.toObject(),
          videos: subcategory.videos ? subcategory.videos.filter(v => v && (v.isFree === true || v.isPreview === true)) : []
        })),
      videos: category.videos ? category.videos.filter(v => v && (v.isFree === true || v.isPreview === true)) : []
    }));

  // Only show free videos and preview videos for non-purchasers (legacy support)
  const freeVideos = course.videos.filter(v => v.isFree === true || v.isPreview === true);

  res.json({
    ...course.toObject(),
    content: filteredContent,
    videos: freeVideos,
    hasPurchased: false,
    accessType: 'limited',
    totalLockedVideos: course.videos.length - freeVideos.length
  });
});

/* =========================================================
   @desc    Check course access
   @route   GET /api/courses/:id/access
   @access  Private
========================================================= */
const checkCourseAccess = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user._id;

  const order = await Order.findOne({
    user: userId,
    course: courseId,
    isPaid: true,
  });

  res.json({
    hasAccess: !!order,
    purchaseDate: order ? order.createdAt : null
  });
});

/* =========================================================
   @desc    Get video by ID with access control
   @route   GET /api/courses/:courseId/videos/:videoId
   @access  Private
========================================================= */
const getVideoById = asyncHandler(async (req, res) => {
  const { courseId, videoId } = req.params;
  const userId = req.user._id;

  const video = await Video.findById(videoId).populate('course');

  if (!video || video.course._id.toString() !== courseId) {
    res.status(404);
    throw new Error("Video not found");
  }

  // Check if video is free or user has purchased the course
  if (video.isFree || video.isPreview) {
    // Increment view count
    video.views += 1;
    await video.save();

    return res.json(video);
  }

  // Check if user has purchased the course
  const order = await Order.findOne({
    user: userId,
    course: courseId,
    isPaid: true,
  });

  if (!order) {
    res.status(403);
    throw new Error("Please purchase the course to access this video");
  }

  // Increment view count
  video.views += 1;
  await video.save();

  // Update user's progress
  const user = await User.findById(userId);
  const courseProgress = user.purchasedCourses.find(
    pc => pc.course.toString() === courseId
  );

  if (courseProgress && !courseProgress.completedVideos.includes(videoId)) {
    courseProgress.completedVideos.push(videoId);

    // Calculate progress percentage
    const totalVideos = await Video.countDocuments({ course: courseId });
    courseProgress.progress = Math.round((courseProgress.completedVideos.length / totalVideos) * 100);

    await user.save();
  }

  res.json(video);
});

/* =========================================================
   @desc    Upload video to hierarchical content structure
   @route   POST /api/courses/admin/:id/content/videos
   @access  Private/Admin
========================================================= */
const uploadVideoToContent = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const {
    title,
    description,
    duration,
    order,
    isFree,
    isPreview,
    categoryIndex,
    subcategoryIndex
  } = req.body;
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No video file uploaded");
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: `institute-website/courses/${course._id}/videos`,
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    // Clean up temp file asynchronously
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    // Create video document
    const video = new Video({
      title,
      description,
      videoUrl: result.secure_url,
      thumbnailUrl: result.secure_url.replace(/\.[^/.]+$/, ".jpg"),
      duration: duration || '0:00',
      order: order || 1,
      isFree: isFree === "true" || isFree === true,
      isPreview: isPreview === "true" || isPreview === true,
      course: courseId,
    });

    const createdVideo = await video.save();

    // Add video to hierarchical content structure
    if (categoryIndex !== undefined) {
      if (!course.content[categoryIndex]) {
        res.status(400);
        throw new Error("Invalid category index");
      }

      if (subcategoryIndex !== undefined) {
        // Add to subcategory
        if (!course.content[categoryIndex].subcategories[subcategoryIndex]) {
          res.status(400);
          throw new Error("Invalid subcategory index");
        }
        course.content[categoryIndex].subcategories[subcategoryIndex].videos.push(createdVideo._id);
      } else {
        // Add to category directly
        course.content[categoryIndex].videos.push(createdVideo._id);
      }
    } else {
      // Add to legacy videos array
      course.videos.push(createdVideo._id);
    }

    await course.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully to content structure",
      video: createdVideo
    });

  } catch (error) {
    // Clean up temp file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file on error:', err);
      });
    }

    console.error('Video upload error:', error);
    res.status(500);
    throw new Error("Failed to upload video: " + error.message);
  }
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadVideo,
  uploadVideoToContent,
  getAllCoursesPublic,
  getCourseByIdPublic,
  checkCourseAccess,
  getVideoById,
};
