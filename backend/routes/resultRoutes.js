const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { submitTestResult, getMyResults, getAllResults } = require('../controllers/resultController');
const router = express.Router();

// Student routes
router.route('/').post(protect, submitTestResult).get(protect, getMyResults);

// Admin routes
router.route('/admin').get(protect, admin, getAllResults);

module.exports = router;

