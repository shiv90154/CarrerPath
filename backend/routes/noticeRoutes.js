const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
    createNotice,
    updateNotice,
    deleteNotice,
    togglePublishStatus,
    getAllNoticesAdmin,
    getPublishedNotices,
    getNoticeById,
    getStatistics,
} = require("../controllers/noticeController");

/* ===========================
   ADMIN ROUTES
=========================== */

// Notice statistics (admin) - MUST BE BEFORE /:id route
router.get("/admin/stats", protect, admin, getStatistics);

// Create notice
router.post("/admin", protect, admin, createNotice);

// Get all notices (admin)
router.get("/admin/all", protect, admin, getAllNoticesAdmin);

// Toggle publish status
router.patch("/admin/toggle-publish/:id", protect, admin, togglePublishStatus);

// Get / update / delete notice by ID (admin)
router
    .route("/admin/:id")
    .get(protect, admin, getNoticeById)
    .put(protect, admin, updateNotice)
    .delete(protect, admin, deleteNotice);

/* ===========================
   PUBLIC ROUTES
=========================== */

// Get published notices (public)
router.get("/published", getPublishedNotices);

// Get notice by ID (public)
router.get("/:id", getNoticeById);

module.exports = router;