const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getVideoAccess, getCourseVideos } = require('../controllers/videoController');

// Protected video access routes
router.get('/:videoId/access', protect, getVideoAccess);
router.get('/course/:courseId', protect, getCourseVideos);

module.exports = router;