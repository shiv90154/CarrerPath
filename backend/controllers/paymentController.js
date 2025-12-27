const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const TestSeries = require('../models/TestSeries');
const Ebook = require('../models/Ebook');
const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to handle free content access
const handleFreeContentAccess = asyncHandler(async (req, res, { courseId, testSeriesId, ebookId, materialId }) => {
  const userId = req.user._id;

  try {
    let product = null;
    let productType = '';
    let orderData = {
      user: userId,
      paymentMethod: 'free',
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: `free_${Date.now()}`,
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      },
    };

    if (courseId) {
      product = await Course.findById(courseId);
      productType = 'Course';
      orderData.course = courseId;
    } else if (testSeriesId) {
      product = await TestSeries.findById(testSeriesId);
      productType = 'TestSeries';
      orderData.testSeries = testSeriesId;
    } else if (ebookId) {
      product = await Ebook.findById(ebookId);
      productType = 'Ebook';
      orderData.ebook = ebookId;
    } else if (materialId) {
      product = await StudyMaterial.findById(materialId);
      productType = 'StudyMaterial';
      orderData.items = [{
        material: materialId,
        price: 0,
        quantity: 1
      }];
    }

    if (!product) {
      res.status(404);
      throw new Error(`${productType} not found`);
    }

    // Verify the content is actually free
    const isFree = product.price === 0 || product.isFree === true || product.type === 'Free';
    if (!isFree) {
      res.status(400);
      throw new Error('This content is not free');
    }

    // Check if user already has access
    const existingOrder = await Order.findOne({
      user: userId,
      $or: [
        { course: courseId },
        { testSeries: testSeriesId },
        { ebook: ebookId },
        { 'items.material': materialId }
      ],
      isPaid: true,
    });

    if (existingOrder) {
      return res.json({
        success: true,
        message: 'You already have access to this content',
        order: existingOrder,
        alreadyOwned: true
      });
    }

    // Create free access order
    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Update user's purchased items
    const user = await User.findById(userId);
    if (courseId && user.purchasedCourses) {
      const existingPurchase = user.purchasedCourses.find(
        pc => pc.course.toString() === courseId
      );
      if (!existingPurchase) {
        user.purchasedCourses.push({
          course: courseId,
          purchaseDate: new Date(),
          progress: 0,
          completedVideos: []
        });
        await user.save();
      }
    }

    res.json({
      success: true,
      message: `Free ${productType.toLowerCase()} access granted successfully!`,
      order: savedOrder,
      product: {
        id: product._id,
        title: product.title,
        type: productType.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Free content access error:', error);
    res.status(500);
    throw new Error('Failed to grant free access. Please try again.');
  }
});

// @desc    Create Razorpay order
// @route   POST /api/payments/orders
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, courseId, testSeriesId, ebookId, materialId } = req.body;

  console.log('Creating Razorpay order with data:', { amount, courseId, testSeriesId, ebookId, materialId });

  // Validate required fields
  if (amount === undefined || amount === null || amount < 0) {
    res.status(400);
    throw new Error('Valid amount is required');
  }

  // Handle free content (price = 0) - grant immediate access
  if (amount === 0) {
    return await handleFreeContentAccess(req, res, { courseId, testSeriesId, ebookId, materialId });
  }

  if (!courseId && !testSeriesId && !ebookId && !materialId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // Check Razorpay configuration
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay credentials not configured');
    res.status(500);
    throw new Error('Payment system not configured. Please contact administrator.');
  }

  let product = null;
  let productType = '';

  try {
    if (courseId) {
      product = await Course.findById(courseId);
      productType = 'Course';
    } else if (testSeriesId) {
      product = await TestSeries.findById(testSeriesId);
      productType = 'TestSeries';
    } else if (ebookId) {
      product = await Ebook.findById(ebookId);
      productType = 'Ebook';
    } else if (materialId) {
      product = await StudyMaterial.findById(materialId);
      productType = 'StudyMaterial';
    }

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    console.log('Product found:', { id: product._id, title: product.title, type: productType });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
      currency: 'INR',
      receipt: `${req.user._id}-${Date.now()}`,
      payment_capture: 1, // 1 for auto capture
    };

    console.log('Creating Razorpay order with options:', options);

    const razorpayOrder = await razorpay.orders.create(options);
    console.log('Razorpay order created:', razorpayOrder);

    const order = new Order({
      user: req.user._id,
      // Legacy fields for backward compatibility
      course: courseId || null,
      testSeries: testSeriesId || null,
      ebook: ebookId || null,
      // New items array for study materials and future flexibility
      items: materialId ? [{
        material: materialId,
        price: amount,
        quantity: 1
      }] : [],
      totalPrice: amount,
      isPaid: false,
      paymentMethod: 'Razorpay',
      paymentResult: {
        id: razorpayOrder.id,
        status: 'pending',
        update_time: Date.now(),
        email_address: req.user.email
      },
    });

    const createdOrder = await order.save();
    console.log('Order saved to database:', createdOrder._id);

    const payment = new Payment({
      user: req.user._id,
      order: createdOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency: 'INR',
      status: 'initiated',
    });

    await payment.save();
    console.log('Payment record created');

    const response = {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      description: `${productType} Purchase: ${product.title}`,
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500);
    throw new Error(`Error creating Razorpay order: ${error.message}`);
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Payment is authentic, update order and payment status
    const order = await Order.findOne({ 'paymentResult.id': razorpay_order_id });
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (order && payment) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'completed',
        update_time: Date.now(),
        email_address: req.user.email,
      };
      await order.save();

      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = 'paid';
      payment.paidAt = Date.now();
      await payment.save();

      res.json({ message: 'Payment successful', orderId: order._id });
    } else {
      res.status(404);
      throw new Error('Order or Payment not found');
    }
  } else {
    // Payment is not authentic, update payment status to failed
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }
    res.status(400);
    throw new Error('Payment verification failed');
  }
});

// @desc    Get all payments (Admin only)
// @route   GET /api/payments/admin
// @access  Private/Admin
const getAdminPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({}).populate('user', 'name email').populate('order');
  res.json(payments);
});

// @desc    Get user payments (Student only)
// @route   GET /api/payments/myorders
// @access  Private
const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).populate('order');
  res.json(payments);
});

// @desc    Test payment system configuration
// @route   GET /api/payments/test
// @access  Private
const testPaymentSystem = asyncHandler(async (req, res) => {
  const checks = {
    razorpayConfigured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured',
    userAuthenticated: !!req.user,
    timestamp: new Date().toISOString()
  };

  res.json({
    message: 'Payment system test endpoint',
    status: 'OK',
    checks
  });
});

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getAdminPayments,
  getUserPayments,
  testPaymentSystem,
};

