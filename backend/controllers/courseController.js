const asyncHandler = require("express-async-handler");
const fs = require("fs");

const Course = require("../models/Course");
const Order = require("../models/Order");
const User = require("../models/User");
const emailNotifications = require("../middleware/emailNotifications");

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
    whatYouWillLearn
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
    instructor: req.user._id,
  });

  const createdCourse = await course.save();

  // Send new course notification to all users
  try {
    await emailNotifications.notifyNewCourse({
      title: createdCourse.title,
      description: createdCourse.description,
      instructor: createdCourse.instructor || 'Career Pathway Institute'
    });
  } catch (emailError) {
    console.error('New course notification error:', emailError);
    // Don't fail course creation if email fails
  }

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
    .populate("instructor", "name email");

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

  await course.deleteOne();
  res.json({ message: "Course deleted successfully" });
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
   @desc    Get course by ID (Public)
   @route   GET /api/courses/:id
   @access  Public / Optional Auth
========================================================= */
const getCourseByIdPublic = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name bio avatar");

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
      itemType: 'course',
      itemId: course._id,
      status: 'approved',
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
          purchaseDate: order.approvedAt || order.createdAt,
          progress: 0,
          completedVideos: []
        });
        await userDoc.save();
      }
    }
  }

  res.json({
    ...course.toObject(),
    hasPurchased,
    accessType: hasPurchased ? 'full' : 'limited'
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
    itemType: 'course',
    itemId: courseId,
    status: 'approved',
  });

  res.json({
    hasAccess: !!order,
    purchaseDate: order ? order.approvedAt || order.createdAt : null
  });
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAllCoursesPublic,
  getCourseByIdPublic,
  checkCourseAccess,
};