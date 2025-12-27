const express = require("express");
const router = express.Router();

const { protect, optionalAuth, admin } = require("../middleware/authMiddleware");

// 🔴 FIX: import multer INSTANCE (same one used everywhere)
const upload = require("../middleware/uploadMiddleware");

const {
  createEbook,
  getAllEbooks,
  getEbookById,
  updateEbook,
  deleteEbook,
  getAllEbooksPublic,
  getEbookByIdPublic,
} = require("../controllers/ebookController");

/* ===========================
   ADMIN ROUTES (E-BOOKS)
=========================== */

// Create ebook (PDF + cover image)
router.post(
  "/admin",
  protect,
  admin,
  upload.fields([
    { name: "ebook", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createEbook
);

// Get all ebooks (admin)
router.get("/admin", protect, admin, getAllEbooks);

// Get / update / delete ebook by ID (admin)
router
  .route("/admin/:id")
  .get(protect, admin, getEbookById)
  .put(
    protect,
    admin,
    upload.fields([
      { name: "ebook", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    updateEbook
  )
  .delete(protect, admin, deleteEbook);

/* ===========================
   PUBLIC / STUDENT ROUTES
=========================== */

// Get all ebooks (public)
router.get("/", getAllEbooksPublic);

// Get ebook by ID (public with optional auth)
router.get("/:id", optionalAuth, getEbookByIdPublic);

module.exports = router;
