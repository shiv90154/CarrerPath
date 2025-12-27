const express = require("express");
const router = express.Router();

const { protect, admin, optionalAuth } = require("../middleware/authMiddleware");

// 🔴 FIX: ALWAYS use the shared multer instance
const upload = require("../middleware/uploadMiddleware");

const {
  createStudyMaterial,
  getAllStudyMaterials,
  getStudyMaterialById,
  updateStudyMaterial,
  deleteStudyMaterial,
  getAllStudyMaterialsPublic,
  getStudyMaterialByIdPublic,
  getStudyMaterialStats,
} = require("../controllers/studyMaterialController");

/* ===========================
   ADMIN ROUTES
=========================== */

// Study material statistics (admin) - MUST BE BEFORE /:id route
router.get("/admin/stats", protect, admin, getStudyMaterialStats);

// Create study material (file + cover image)
router.post(
  "/admin",
  protect,
  admin,
  upload.fields([
    { name: "materialFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createStudyMaterial
);

// Get all study materials (admin)
router.get("/admin", protect, admin, getAllStudyMaterials);

// Get / update / delete study material by ID (admin)
router
  .route("/admin/:id")
  .get(protect, admin, getStudyMaterialById)
  .put(
    protect,
    admin,
    upload.fields([
      { name: "materialFile", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    updateStudyMaterial
  )
  .delete(protect, admin, deleteStudyMaterial);

/* ===========================
   PUBLIC ROUTES
=========================== */

// Get all study materials (public)
router.get("/", getAllStudyMaterialsPublic);

// Get study material by ID (public with optional auth)
router.get("/:id", optionalAuth, getStudyMaterialByIdPublic);

module.exports = router;
