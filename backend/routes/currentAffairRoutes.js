const express = require("express");
const router = express.Router();

const currentAffairController = require("../controllers/currentAffairController");

// 🔴 FIX: use correct middleware name
const { protect, admin } = require("../middleware/authMiddleware");

/* ===========================
   ADMIN ROUTES (PROTECTED) - MUST BE FIRST
=========================== */

// Admin views (specific routes first)
router.get("/admin/all", protect, admin, currentAffairController.getAllCurrentAffairsAdmin);
router.get("/stats/summary", protect, admin, currentAffairController.getStatistics);

// Admin CRUD
router.post("/", protect, admin, currentAffairController.createCurrentAffair);
router.put("/:id", protect, admin, currentAffairController.updateCurrentAffair);
router.delete("/:id", protect, admin, currentAffairController.deleteCurrentAffair);

// Admin actions
router.patch("/toggle-publish/:id", protect, admin, currentAffairController.togglePublishStatus);

/* ===========================
   PUBLIC ROUTES
=========================== */

// IMPORTANT: static routes FIRST
router.get("/filters/options", currentAffairController.getFilterOptions);
router.get("/published", currentAffairController.getPublishedCurrentAffairs);

// Dynamic routes LAST
router.get("/:id", currentAffairController.getCurrentAffairById);

module.exports = router;
