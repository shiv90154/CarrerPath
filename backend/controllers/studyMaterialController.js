const asyncHandler = require('express-async-handler');
const StudyMaterial = require('../models/StudyMaterial');
const cloudinary = require('../utils/cloudinary');
const Order = require('../models/Order');

// @desc    Create new study material
// @route   POST /api/studymaterials/admin
// @access  Private/Admin
const createStudyMaterial = asyncHandler(async (req, res) => {
  const { title, description, year, examType, subject, type, price, language, pages } = req.body;

  let fileUrl = '';
  let coverImageUrl = '/images/default-paper-cover.jpg';

  // Upload study material file (PDF)
  if (req.files && req.files.materialFile) {
    const result = await cloudinary.uploader.upload(req.files.materialFile[0].path, {
      folder: 'study-materials',
      resource_type: 'auto',
    });
    fileUrl = result.secure_url;
  }

  // Upload cover image if provided
  if (req.files && req.files.coverImage) {
    const result = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
      folder: 'study-material-covers',
      width: 300,
      height: 400,
      crop: 'fill',
    });
    coverImageUrl = result.secure_url;
  }

  const studyMaterial = new StudyMaterial({
    title,
    description,
    year,
    examType,
    subject,
    type,
    price: type === 'Paid' ? price : 0,
    fileUrl,
    coverImage: coverImageUrl,
    language: language || 'English',
    pages: pages || 0,
    author: req.user._id,
  });

  const createdMaterial = await studyMaterial.save();
  res.status(201).json(createdMaterial);
});

// @desc    Get all study materials (Admin)
// @route   GET /api/studymaterials/admin
// @access  Private/Admin
const getAllStudyMaterials = asyncHandler(async (req, res) => {
  const materials = await StudyMaterial.find({})
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
  res.json(materials);
});

// @desc    Get single study material (Admin)
// @route   GET /api/studymaterials/admin/:id
// @access  Private/Admin
const getStudyMaterialById = asyncHandler(async (req, res) => {
  const material = await StudyMaterial.findById(req.params.id)
    .populate('author', 'name email');

  if (material) {
    res.json(material);
  } else {
    res.status(404);
    throw new Error('Study material not found');
  }
});

// @desc    Update study material
// @route   PUT /api/studymaterials/admin/:id
// @access  Private/Admin
const updateStudyMaterial = asyncHandler(async (req, res) => {
  const { title, description, year, examType, subject, type, price, language, pages } = req.body;

  const material = await StudyMaterial.findById(req.params.id);

  if (!material) {
    res.status(404);
    throw new Error('Study material not found');
  }

  let updateData = {
    title: title || material.title,
    description: description || material.description,
    year: year || material.year,
    examType: examType || material.examType,
    subject: subject || material.subject,
    type: type || material.type,
    language: language || material.language,
    pages: pages || material.pages,
    price: type === 'Paid' ? (price || material.price) : 0,
  };

  // Update cover image if provided
  if (req.files && req.files.coverImage) {
    // Delete old cover image if not default
    if (material.coverImage && !material.coverImage.includes('/images/default-paper-cover.jpg')) {
      const publicId = material.coverImage.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`study-material-covers/${publicId}`);
      } catch (error) {
        // Error deleting old cover image
      }
    }

    const result = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
      folder: 'study-material-covers',
      width: 300,
      height: 400,
      crop: 'fill',
    });
    updateData.coverImage = result.secure_url;
  }

  // Update material file if provided
  if (req.files && req.files.materialFile) {
    // Delete old file
    if (material.fileUrl) {
      const publicId = material.fileUrl.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`study-materials/${publicId}`);
      } catch (error) {
        // Error deleting old file
      }
    }

    const result = await cloudinary.uploader.upload(req.files.materialFile[0].path, {
      folder: 'study-materials',
      resource_type: 'auto',
    });
    updateData.fileUrl = result.secure_url;
  }

  const updatedMaterial = await StudyMaterial.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json(updatedMaterial);
});

// @desc    Delete study material
// @route   DELETE /api/studymaterials/admin/:id
// @access  Private/Admin
const deleteStudyMaterial = asyncHandler(async (req, res) => {
  const material = await StudyMaterial.findById(req.params.id);

  if (material) {
    // Delete files from Cloudinary
    if (material.fileUrl) {
      const filePublicId = material.fileUrl.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`study-materials/${filePublicId}`);
      } catch (error) {
        // Error deleting material file
      }
    }

    if (material.coverImage && !material.coverImage.includes('/images/default-paper-cover.jpg')) {
      const coverPublicId = material.coverImage.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`study-material-covers/${coverPublicId}`);
      } catch (error) {
        // Error deleting cover image
      }
    }

    await material.deleteOne();
    res.json({ message: 'Study material removed successfully' });
  } else {
    res.status(404);
    throw new Error('Study material not found');
  }
});

// @desc    Get all study materials for public
// @route   GET /api/studymaterials
// @access  Public
const getAllStudyMaterialsPublic = asyncHandler(async (req, res) => {
  const { examType, year, subject, type } = req.query;

  let query = { isActive: true };

  // Apply filters if provided
  if (examType) query.examType = examType;
  if (year) query.year = year;
  if (subject) query.subject = subject;
  if (type) query.type = type;

  const materials = await StudyMaterial.find(query)
    .populate('author', 'name')
    .select('-fileUrl') // Don't include fileUrl in list
    .sort({ year: -1, createdAt: -1 });

  // Get available filters
  const examTypes = await StudyMaterial.distinct('examType', { isActive: true });
  const years = await StudyMaterial.distinct('year', { isActive: true }).sort({ year: -1 });
  const subjects = await StudyMaterial.distinct('subject', { isActive: true });

  res.json({
    materials,
    filters: {
      examTypes,
      years,
      subjects,
      types: ['Free', 'Paid'],
    },
  });
});

// @desc    Get single study material for public with access control
// @route   GET /api/studymaterials/:id
// @access  Public (with auth for paid)
const getStudyMaterialByIdPublic = asyncHandler(async (req, res) => {
  const material = await StudyMaterial.findById(req.params.id)
    .populate('author', 'name');

  if (!material || !material.isActive) {
    res.status(404);
    throw new Error('Study material not found');
  }

  let userHasPurchased = false;

  // Check if user has purchased this material (for paid)
  if (req.user && material.type === 'Paid') {
    // Check both new items array structure and legacy structure
    const order = await Order.findOne({
      user: req.user._id,
      $or: [
        { 'items.material': material._id }, // New structure
        { studyMaterial: material._id }     // Legacy structure (if exists)
      ],
      isPaid: true,
    });

    if (order) {
      userHasPurchased = true;
    }
  }

  // Increment download count if user accesses the file
  if (material.type === 'Free' || userHasPurchased) {
    material.downloads += 1;
    await material.save();
  }

  // Prepare response
  const responseData = {
    _id: material._id,
    title: material.title,
    description: material.description,
    year: material.year,
    examType: material.examType,
    subject: material.subject,
    type: material.type,
    price: material.price,
    coverImage: material.coverImage,
    pages: material.pages,
    language: material.language,
    author: material.author,
    downloads: material.downloads,
    createdAt: material.createdAt,
    updatedAt: material.updatedAt,
  };

  // Add fileUrl if accessible
  if (material.type === 'Free' || userHasPurchased) {
    responseData.fileUrl = material.fileUrl;
    responseData.access = 'full';
  } else {
    responseData.access = 'locked';
    responseData.message = 'Purchase required to download this material';
  }

  res.json(responseData);
});

// @desc    Get study material statistics
// @route   GET /api/studymaterials/stats/admin
// @access  Private/Admin
const getStudyMaterialStats = asyncHandler(async (req, res) => {
  const stats = await StudyMaterial.aggregate([
    {
      $group: {
        _id: null,
        totalMaterials: { $sum: 1 },
        freeMaterials: { $sum: { $cond: [{ $eq: ['$type', 'Free'] }, 1, 0] } },
        paidMaterials: { $sum: { $cond: [{ $eq: ['$type', 'Paid'] }, 1, 0] } },
        totalDownloads: { $sum: '$downloads' },
        byExamType: { $push: { examType: '$examType', count: 1 } },
      },
    },
    {
      $project: {
        _id: 0,
        totalMaterials: 1,
        freeMaterials: 1,
        paidMaterials: 1,
        totalDownloads: 1,
      },
    },
  ]);

  // Get recent materials
  const recentMaterials = await StudyMaterial.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('author', 'name');

  res.json({
    stats: stats[0] || {
      totalMaterials: 0,
      freeMaterials: 0,
      paidMaterials: 0,
      totalDownloads: 0,
    },
    recentMaterials,
  });
});

module.exports = {
  createStudyMaterial,
  getAllStudyMaterials,
  getStudyMaterialById,
  updateStudyMaterial,
  deleteStudyMaterial,
  getAllStudyMaterialsPublic,
  getStudyMaterialByIdPublic,
  getStudyMaterialStats,
};