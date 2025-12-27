const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Course = require('../models/Course');
const TestSeries = require('../models/TestSeries');
const Ebook = require('../models/Ebook');
const StudyMaterial = require('../models/StudyMaterial');
const Result = require('../models/Result');
const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Get student's purchased courses
// @route   GET /api/student/courses
// @access  Private
const getStudentCourses = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    course: { $ne: null },
    isPaid: true,
  }).populate({
    path: 'course',
    populate: {
      path: 'instructor',
      select: 'name'
    }
  });

  const courses = orders.map(order => ({
    ...order.course.toObject(),
    purchaseDate: order.createdAt,
    orderId: order._id
  }));

  res.json(courses);
});

// @desc    Get student's purchased test series
// @route   GET /api/student/testseries
// @access  Private
const getStudentTestSeries = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    testSeries: { $ne: null },
    isPaid: true,
  }).populate({
    path: 'testSeries',
    populate: {
      path: 'instructor',
      select: 'name'
    }
  });

  const testSeries = orders.map(order => ({
    ...order.testSeries.toObject(),
    purchaseDate: order.createdAt,
    orderId: order._id
  }));

  res.json(testSeries);
});

// @desc    Get student's purchased study materials
// @route   GET /api/student/studymaterials
// @access  Private
const getStudentStudyMaterials = asyncHandler(async (req, res) => {
  // Get both free and paid study materials that user has access to
  const orders = await Order.find({
    user: req.user._id,
    'items.material': { $ne: null },
    isPaid: true,
  }).populate({
    path: 'items.material',
    populate: {
      path: 'author',
      select: 'name'
    }
  });

  // Get free study materials that user has accessed
  const freeStudyMaterials = await StudyMaterial.find({
    type: 'Free',
    isActive: true
  }).populate('author', 'name');

  // Combine paid materials from orders
  const paidMaterials = [];
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.material) {
        paidMaterials.push({
          ...item.material.toObject(),
          purchaseDate: order.createdAt,
          orderId: order._id
        });
      }
    });
  });

  // Add free materials (simulate purchase date as first access)
  const freeMaterials = freeStudyMaterials.map(material => ({
    ...material.toObject(),
    purchaseDate: material.createdAt, // Use creation date as "purchase" date for free materials
    orderId: null
  }));

  // Combine and sort by purchase date
  const allMaterials = [...paidMaterials, ...freeMaterials].sort(
    (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
  );

  res.json(allMaterials);
});

// @desc    Get student's purchased ebooks
// @route   GET /api/student/ebooks
// @access  Private
const getStudentEbooks = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    ebook: { $ne: null },
    isPaid: true,
  }).populate({
    path: 'ebook',
    populate: {
      path: 'author',
      select: 'name'
    }
  });

  const ebooks = orders.map(order => ({
    ...order.ebook.toObject(),
    purchaseDate: order.createdAt,
    orderId: order._id
  }));

  res.json(ebooks);
});

// @desc    Get student's test results
// @route   GET /api/student/results
// @access  Private
const getStudentTestResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ user: req.user._id })
    .populate('test', 'title')
    .populate('liveTest', 'title')
    .sort({ createdAt: -1 });

  const formattedResults = results.map(result => ({
    _id: result._id,
    testName: result.test ? result.test.title : result.liveTest.title,
    score: result.score,
    totalQuestions: result.totalQuestions,
    percentage: Math.round((result.score / result.totalQuestions) * 100),
    dateTaken: result.createdAt,
    testType: result.test ? 'Regular Test' : 'Live Test'
  }));

  res.json(formattedResults);
});

// @desc    Get student's payment history
// @route   GET /api/student/payments
// @access  Private
const getStudentPaymentHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    isPaid: true,
  })
    .populate('course', 'title')
    .populate('testSeries', 'title')
    .populate('ebook', 'title')
    .sort({ createdAt: -1 });

  const payments = orders.map(order => ({
    _id: order._id,
    totalPrice: order.totalPrice,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    paymentMethod: order.paymentMethod,
    productType: order.course ? 'Course' : order.testSeries ? 'Test Series' : 'E-Book',
    productName: order.course ? order.course.title :
      order.testSeries ? order.testSeries.title :
        order.ebook ? order.ebook.title : 'Unknown',
    status: 'Completed'
  }));

  res.json(payments);
});

// @desc    Get student dashboard stats
// @route   GET /api/student/stats
// @access  Private
const getStudentStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get counts
  const totalCourses = await Order.countDocuments({
    user: userId,
    course: { $ne: null },
    isPaid: true,
  });

  const totalTestSeries = await Order.countDocuments({
    user: userId,
    testSeries: { $ne: null },
    isPaid: true,
  });

  const totalEbooks = await Order.countDocuments({
    user: userId,
    ebook: { $ne: null },
    isPaid: true,
  });

  const totalStudyMaterials = await Order.countDocuments({
    user: userId,
    'items.material': { $ne: null },
    isPaid: true,
  }) + await StudyMaterial.countDocuments({ type: 'Free', isActive: true });

  const totalTestsTaken = await Result.countDocuments({ user: userId });

  // Get total spent
  const orders = await Order.find({
    user: userId,
    isPaid: true,
  });

  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  // Get recent activity
  const recentOrders = await Order.find({
    user: userId,
    isPaid: true,
  })
    .populate('course', 'title')
    .populate('testSeries', 'title')
    .populate('ebook', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

  const recentActivity = recentOrders.map(order => ({
    type: 'purchase',
    title: order.course ? order.course.title :
      order.testSeries ? order.testSeries.title :
        order.ebook ? order.ebook.title : 'Unknown',
    date: order.createdAt,
    amount: order.totalPrice
  }));

  res.json({
    totalCourses,
    totalTestSeries,
    totalEbooks,
    totalStudyMaterials,
    totalTestsTaken,
    totalSpent,
    recentActivity
  });
});

// @desc    Get student's course progress
// @route   GET /api/student/progress/:courseId
// @access  Private
const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  // Check if user has purchased the course
  const order = await Order.findOne({
    user: userId,
    course: courseId,
    isPaid: true,
  });

  if (!order) {
    res.status(403);
    throw new Error("Course not purchased");
  }

  const user = await User.findById(userId);
  const courseProgress = user.purchasedCourses.find(
    pc => pc.course.toString() === courseId
  );

  if (!courseProgress) {
    res.status(404);
    throw new Error("Progress not found");
  }

  const course = await Course.findById(courseId).populate('videos');

  res.json({
    courseId,
    progress: courseProgress.progress,
    completedVideos: courseProgress.completedVideos,
    totalVideos: course.videos.length,
    purchaseDate: courseProgress.purchaseDate,
    lastAccessed: courseProgress.lastAccessed || courseProgress.purchaseDate
  });
});

module.exports = {
  getStudentCourses,
  getStudentTestSeries,
  getStudentEbooks,
  getStudentStudyMaterials,
  getStudentTestResults,
  getStudentPaymentHistory,
  getStudentStats,
  getCourseProgress,
};

