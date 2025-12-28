const CurrentAffairsPackage = require('../models/CurrentAffairsPackage');
const CurrentAffairsSubscription = require('../models/CurrentAffairsSubscription');
const CurrentAffair = require('../models/CurrentAffair');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Get all current affairs packages
// @route   GET /api/current-affairs-packages
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' 