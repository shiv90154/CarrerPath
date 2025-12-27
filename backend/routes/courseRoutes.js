const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadVideo,
  getAllCoursesPublic,
  getCourseByIdPublic,
  checkCourseAccess,
  getVideoById,
} = require("../controllers/courseController");

const { protect, admin } = require("../middleware/authMiddleware");

// 🔴 FIX: import multer INSTANCE (not utils, not object)
const upload = require("../middleware/uploadMiddleware");

/* ===========================
   ADMIN ROUTES
=========================== */

// Create course
router.post("/", protect, admin, createCourse);

// Get all courses (admin)
router.get("/admin", protect, admin, getCourses);

// Get / update / delete course by ID (admin)
router
  .route("/admin/:id")
  .get(protect, admin, getCourseById)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

// Upload video to course (ADMIN ONLY)
router.post(
  "/admin/:id/videos",
  protect,
  admin,
  upload.single("video"),
  uploadVideo
);

/* ===========================
   PUBLIC / STUDENT ROUTES
=========================== */

// Get all courses (public)
router.get("/", getAllCoursesPublic);

// Get course by ID (optional auth)
router.get("/:id", getCourseByIdPublic);

// Check course access (protected)
router.get("/:id/access", protect, checkCourseAccess);

// Get video by ID with access control (protected)
router.get("/:courseId/videos/:videoId", protect, getVideoById);

module.exports = router;
