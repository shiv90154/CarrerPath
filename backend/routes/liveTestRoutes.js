const express = require('express');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');
const {
    createLiveTest,
    getAllLiveTests,
    getLiveTestById,
    updateLiveTest,
    deleteLiveTest,
    createLiveTestQuestion,
    updateLiveTestQuestion,
    deleteLiveTestQuestion,
    getPublicLiveTests,
    joinLiveTest,
    submitLiveTestAnswers
} = require('../controllers/liveTestController');
const router = express.Router();

// Public routes for Live Tests
router.get('/', optionalAuth, getPublicLiveTests);
router.post('/:id/join', protect, joinLiveTest);
router.post('/:id/submit', protect, submitLiveTestAnswers);

// Admin routes for Live Tests
router.route('/admin').post(protect, admin, createLiveTest).get(protect, admin, getAllLiveTests);
router.route('/admin/:id').get(protect, admin, getLiveTestById).put(protect, admin, updateLiveTest).delete(protect, admin, deleteLiveTest);

// Admin routes for Questions within a Live Test
router.route('/admin/:liveTestId/questions').post(protect, admin, createLiveTestQuestion);
router.route('/admin/:liveTestId/questions/:questionId').put(protect, admin, updateLiveTestQuestion).delete(protect, admin, deleteLiveTestQuestion);

module.exports = router;

