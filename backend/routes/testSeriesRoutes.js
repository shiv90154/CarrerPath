const express = require('express');
const { protect, optionalAuth, admin } = require('../middleware/authMiddleware');
const { createTestSeries, getAllTestSeries, getTestSeriesById, updateTestSeries, deleteTestSeries, createTest, updateTest, deleteTest, createQuestion, updateQuestion, deleteQuestion, getAllTestSeriesPublic, getTestSeriesByIdPublic } = require('../controllers/testSeriesController');
const router = express.Router();

// Admin routes for Test Series
router.route('/admin').post(protect, admin, createTestSeries).get(protect, admin, getAllTestSeries);
router.route('/admin/:id').get(protect, admin, getTestSeriesById).put(protect, admin, updateTestSeries).delete(protect, admin, deleteTestSeries);

// Admin routes for Tests within a Test Series
router.route('/admin/:testSeriesId/tests').post(protect, admin, createTest);
router.route('/admin/:testSeriesId/tests/:testId').put(protect, admin, updateTest).delete(protect, admin, deleteTest);

// Admin routes for Questions within a Test
router.route('/admin/:testSeriesId/tests/:testId/questions').post(protect, admin, createQuestion);
router.route('/admin/:testSeriesId/tests/:testId/questions/:questionId').put(protect, admin, updateQuestion).delete(protect, admin, deleteQuestion);

// Public/Student routes
router.route('/').get(getAllTestSeriesPublic);
router.route('/:id').get(optionalAuth, getTestSeriesByIdPublic); // Optional auth to check if user is logged in

module.exports = router;

