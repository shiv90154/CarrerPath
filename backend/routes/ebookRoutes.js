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

// Upload endpoints for ebook files and cover images
router.post(
  "/upload/ebook",
  protect,
  admin,
  upload.single("ebook"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const cloudinary = require("../utils/cloudinary");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ebooks',
        resource_type: 'raw', // For non-image files like PDFs
      });

      res.json({
        url: result.secure_url,
        fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
        message: "Ebook file uploaded successfully"
      });
    } catch (error) {
      console.error('Ebook upload error:', error);
      res.status(500).json({ message: "Failed to upload ebook file" });
    }
  }
);

router.post(
  "/upload/cover",
  protect,
  admin,
  upload.single("coverImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const cloudinary = require("../utils/cloudinary");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ebook-covers',
        width: 300,
        height: 400,
        crop: 'fill',
      });

      res.json({
        url: result.secure_url,
        message: "Cover image uploaded successfully"
      });
    } catch (error) {
      console.error('Cover upload error:', error);
      res.status(500).json({ message: "Failed to upload cover image" });
    }
  }
);

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
