const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAllCoursesPublic,
  getCourseByIdPublic,
  checkCourseAccess,
} = require("../controllers/courseController");

const { protect, admin } = require("../middleware/authMiddleware");

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

/* ===========================
   PUBLIC / STUDENT ROUTES
=========================== */

// Get all courses (public)
router.get("/", getAllCoursesPublic);

// Get course by ID (optional auth)
router.get("/:id", getCourseByIdPublic);

// Check course access (protected)
router.get("/:id/access", protect, checkCourseAccess);

module.exports = router;
