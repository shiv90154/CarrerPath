const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getStudentCourses,
    getStudentTestSeries,
    getStudentEbooks,
    getStudentStudyMaterials,
    getStudentTestResults,
    getStudentPaymentHistory,
    getStudentStats,
    getCourseProgress
} = require('../controllers/studentController');

const router = express.Router();

router.route('/courses').get(protect, getStudentCourses);
router.route('/testseries').get(protect, getStudentTestSeries);
router.route('/ebooks').get(protect, getStudentEbooks);
router.route('/studymaterials').get(protect, getStudentStudyMaterials);
router.route('/results').get(protect, getStudentTestResults);
router.route('/payments').get(protect, getStudentPaymentHistory);
router.route('/stats').get(protect, getStudentStats);
router.route('/progress/:courseId').get(protect, getCourseProgress);

module.exports = router;

