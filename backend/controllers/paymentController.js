const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');
const Course = require('../models/Course');
const TestSeries = require('../models/TestSeries');
const Ebook = require('../models/Ebook');
const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// Configure multer for screenshot uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/payment-screenshots';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// @desc    Create manual Google Pay order
// @route   POST /api/payments/create-order
// @access  Private
const createManualOrder = asyncHandler(async (req, res) => {
  const { itemType, itemId, amount } = req.body;

  // Validate required fields
  if (!itemType || !itemId || amount === undefined || amount === null) {
    res.status(400);
    throw new Error('Item type, item ID, and amount are required');
  }

  if (amount < 0) {
    res.status(400);
    throw new Error('Amount must be non-negative');
  }

  // Validate itemType
  const validItemTypes = ['course', 'testSeries', 'ebook', 'studyMaterial', 'currentAffairs'];
  if (!validItemTypes.includes(itemType)) {
    res.status(400);
    throw new Error('Invalid item type');
  }

  // Check if item exists
  let item = null;
  let ItemModel = null;

  switch (itemType) {
    case 'course':
      ItemModel = Course;
      break;
    case 'testSeries':
      ItemModel = TestSeries;
      break;
    case 'ebook':
      ItemModel = Ebook;
      break;
    case 'studyMaterial':
      ItemModel = StudyMaterial;
      break;
    default:
      res.status(400);
      throw new Error('Unsupported item type');
  }

  item = await ItemModel.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error(`${itemType} not found`);
  }

  // Check if user already has a pending or approved order for this item
  const existingOrder = await Order.findOne({
    user: req.user._id,
    itemType,
    itemId,
    status: { $in: ['pending', 'approved'] }
  });

  if (existingOrder) {
    if (existingOrder.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'You already have access to this content'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending payment for this content. Please wait for admin approval.'
      });
    }
  }

  // Handle free content (amount = 0)
  if (amount === 0) {
    const freeOrder = new Order({
      user: req.user._id,
      itemType,
      itemId,
      amount: 0,
      paymentMethod: 'free',
      status: 'approved',
      approvedAt: new Date()
    });

    await freeOrder.save();

    // Update user's purchased items
    await updateUserPurchases(req.user._id, itemType, itemId, freeOrder.createdAt);

    return res.json({
      success: true,
      message: 'Free content access granted!',
      order: freeOrder
    });
  }

  // Create pending order for paid content
  const order = new Order({
    user: req.user._id,
    itemType,
    itemId,
    amount,
    paymentMethod: 'google_pay_manual',
    status: 'pending'
  });

  const savedOrder = await order.save();

  res.json({
    success: true,
    message: 'Order created successfully. Please make payment and upload screenshot.',
    order: savedOrder,
    googlePayDetails: {
      phoneNumber: process.env.GOOGLE_PAY_NUMBER || '9876543210',
      upiId: process.env.GOOGLE_PAY_UPI_ID || 'merchant@paytm',
      amount: amount
    }
  });
});

// @desc    Upload payment screenshot
// @route   POST /api/payments/upload-screenshot/:orderId
// @access  Private
const uploadPaymentScreenshot = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to upload screenshot for this order');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Screenshot can only be uploaded for pending orders');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No screenshot file uploaded');
  }

  // Update order with screenshot URL
  order.screenshotUrl = `/uploads/payment-screenshots/${req.file.filename}`;
  await order.save();

  res.json({
    success: true,
    message: 'Payment screenshot uploaded successfully. Waiting for admin approval.',
    order
  });
});

// @desc    Get pending payments for admin approval
// @route   GET /api/payments/admin/pending
// @access  Private/Admin
const getPendingPayments = asyncHandler(async (req, res) => {
  const pendingOrders = await Order.find({ status: 'pending' })
    .populate('user', 'name email phone')
    .populate('itemId')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders: pendingOrders
  });
});

// @desc    Approve payment
// @route   PUT /api/payments/admin/approve/:orderId
// @access  Private/Admin
const approvePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('user').populate('itemId');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Only pending orders can be approved');
  }

  // Update order status
  order.status = 'approved';
  order.approvedBy = req.user._id;
  order.approvedAt = new Date();
  await order.save();

  // Update user's purchased items
  await updateUserPurchases(order.user._id, order.itemType, order.itemId, order.approvedAt);

  // Send approval email
  try {
    await emailService.sendPaymentApproval(
      order.user.email,
      order.user.name,
      order.amount,
      order.itemId.title,
      order._id
    );
  } catch (emailError) {
    console.error('Payment approval email error:', emailError);
  }

  res.json({
    success: true,
    message: 'Payment approved successfully',
    order
  });
});

// @desc    Reject payment
// @route   PUT /api/payments/admin/reject/:orderId
// @access  Private/Admin
const rejectPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(orderId).populate('user').populate('itemId');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Only pending orders can be rejected');
  }

  // Update order status
  order.status = 'rejected';
  order.rejectionReason = reason || 'Payment verification failed';
  await order.save();

  // Send rejection email
  try {
    await emailService.sendPaymentRejection(
      order.user.email,
      order.user.name,
      order.amount,
      order.itemId.title,
      order.rejectionReason,
      order._id
    );
  } catch (emailError) {
    console.error('Payment rejection email error:', emailError);
  }

  res.json({
    success: true,
    message: 'Payment rejected',
    order
  });
});

// @desc    Get user's orders
// @route   GET /api/payments/my-orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('itemId')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/payments/admin/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, itemType, page = 1, limit = 20 } = req.query;

  let query = {};
  if (status) query.status = status;
  if (itemType) query.itemType = itemType;

  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .populate('itemId')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// Helper function to update user purchases
const updateUserPurchases = async (userId, itemType, itemId, purchaseDate) => {
  const user = await User.findById(userId);
  if (!user) return;

  // Only update for courses (maintain backward compatibility)
  if (itemType === 'course') {
    const existingPurchase = user.purchasedCourses.find(
      pc => pc.course.toString() === itemId.toString()
    );

    if (!existingPurchase) {
      user.purchasedCourses.push({
        course: itemId,
        purchaseDate: purchaseDate,
        progress: 0,
        completedVideos: []
      });
      await user.save();
    }
  }
};

module.exports = {
  createManualOrder,
  uploadPaymentScreenshot: [upload.single('screenshot'), uploadPaymentScreenshot],
  getPendingPayments,
  approvePayment,
  rejectPayment,
  getUserOrders,
  getAllOrders
};

