const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getAllVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    getVideoById
} = require('../controllers/adminVideoController');

// All routes require admin authentication
router.use(protect, admin);

// Video CRUD routes
router.route('/')
    .get(getAllVideos)
    .post(createVideo);

router.route('/:id')
    .get(getVideoById)
    .put(updateVideo)
    .delete(deleteVideo);

module.exports = router;