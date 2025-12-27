const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// @desc    Send OTP for email verification
// @route   POST /api/users/send-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP with expiration (5 minutes)
  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    name
  });

  // Email template
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - EduTech Institute',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">EduTech Institute</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Welcome ${name}!</h2>
          <p style="color: #666; font-size: 16px;">Thank you for registering with EduTech Institute. Please verify your email address to complete your registration.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Your Verification Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: monospace;">
              ${otp}
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 10px;">This code will expire in 5 minutes</p>
          </div>
          
          <p style="color: #666;">If you didn't request this verification, please ignore this email.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({
      message: 'OTP sent successfully to your email',
      email: email
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500);
    throw new Error('Failed to send OTP email');
  }
});

// @desc    Verify OTP and register user
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTPAndRegister = asyncHandler(async (req, res) => {
  const { email, otp, phone, password, role = 'student' } = req.body;

  // Check if OTP exists and is valid
  const storedData = otpStore.get(email);
  if (!storedData) {
    res.status(400);
    throw new Error('OTP not found or expired');
  }

  if (Date.now() > storedData.expires) {
    otpStore.delete(email);
    res.status(400);
    throw new Error('OTP has expired');
  }

  if (storedData.otp !== otp) {
    res.status(400);
    throw new Error('Invalid OTP');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name: storedData.name,
    email,
    phone,
    password,
    role,
    emailVerified: true,
  });

  // Remove OTP from store
  otpStore.delete(email);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Register a new user (legacy - for backward compatibility)
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Resend OTP
// @route   POST /api/users/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if there's an existing OTP request
  const existingData = otpStore.get(email);
  if (!existingData) {
    res.status(400);
    throw new Error('No OTP request found for this email');
  }

  // Generate new 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Update OTP with new expiration
  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    name: existingData.name
  });

  // Email template
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'New Verification Code - Career Pathway',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0B1F33 0%, #1E3A8A 100%); padding: 20px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0;">Career Pathway</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">New Verification Code</h2>
          <p style="color: #666; font-size: 16px;">Here's your new verification code:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Your New Verification Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #1E3A8A; letter-spacing: 5px; font-family: monospace;">
              ${otp}
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 10px;">This code will expire in 5 minutes</p>
          </div>
          
          <p style="color: #666;">If you didn't request this verification, please ignore this email.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({
      message: 'New OTP sent successfully to your email',
      email: email
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500);
    throw new Error('Failed to send OTP email');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.bio = req.body.bio || user.bio;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.gender = req.body.gender || user.gender;
    user.avatar = req.body.avatar || user.avatar;

    // Address update
    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address?.street,
        city: req.body.address.city || user.address?.city,
        state: req.body.address.state || user.address?.state,
        country: req.body.address.country || user.address?.country,
        pincode: req.body.address.pincode || user.address?.pincode,
      };
    }

    // Education update
    if (req.body.education) {
      user.education = {
        qualification: req.body.education.qualification || user.education?.qualification,
        institution: req.body.education.institution || user.education?.institution,
        year: req.body.education.year || user.education?.year,
      };
    }

    // Preferences update
    if (req.body.preferences) {
      user.preferences = {
        examTypes: req.body.preferences.examTypes || user.preferences?.examTypes,
        subjects: req.body.preferences.subjects || user.preferences?.subjects,
        language: req.body.preferences.language || user.preferences?.language,
        notifications: {
          email: req.body.preferences.notifications?.email !== undefined
            ? req.body.preferences.notifications.email
            : user.preferences?.notifications?.email,
          sms: req.body.preferences.notifications?.sms !== undefined
            ? req.body.preferences.notifications.sms
            : user.preferences?.notifications?.sms,
          push: req.body.preferences.notifications?.push !== undefined
            ? req.body.preferences.notifications.push
            : user.preferences?.notifications?.push,
        },
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      bio: updatedUser.bio,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
      avatar: updatedUser.avatar,
      address: updatedUser.address,
      education: updatedUser.education,
      preferences: updatedUser.preferences,
      emailVerified: updatedUser.emailVerified,
      phoneVerified: updatedUser.phoneVerified,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(currentPassword))) {
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });
  } else {
    res.status(400);
    throw new Error('Current password is incorrect');
  }
});

// @desc    Get admin profile
// @route   GET /api/users/admin/profile
// @access  Private/Admin
const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user && user.role === 'admin') {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('Admin not found');
  }
});

module.exports = {
  sendOTP,
  resendOTP,
  verifyOTPAndRegister,
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAdminProfile,
};

