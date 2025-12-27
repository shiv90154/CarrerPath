const asyncHandler = require('express-async-handler');
const Ebook = require('../models/Ebook');
const cloudinary = require('../utils/cloudinary');
const Order = require('../models/Order');

// @desc    Create a new ebook
// @route   POST /api/ebooks/admin
// @access  Private/Admin
const createEbook = asyncHandler(async (req, res) => {
  const { title, description, price, isFree, category } = req.body;

  let fileUrl = '';
  let coverImageUrl = '/images/sample-ebook-cover.jpg'; // Default cover image

  // Upload ebook file if exists
  if (req.files && req.files.ebook) {
    const result = await cloudinary.uploader.upload(req.files.ebook[0].path, {
      folder: 'ebooks',
      resource_type: 'auto',
    });
    fileUrl = result.secure_url;
  }

  // Upload cover image if exists
  if (req.files && req.files.coverImage) {
    const result = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
      folder: 'ebook-covers',
      width: 300,
      height: 400,
      crop: 'fill',
    });
    coverImageUrl = result.secure_url;
  }

  const ebook = new Ebook({
    title,
    description,
    price,
    coverImage: coverImageUrl,
    fileUrl,
    isFree,
    category,
    author: req.user._id,
  });

  const createdEbook = await ebook.save();
  res.status(201).json(createdEbook);
});

// @desc    Get all ebooks (Admin only)
// @route   GET /api/ebooks/admin
// @access  Private/Admin
const getAllEbooks = asyncHandler(async (req, res) => {
  const ebooks = await Ebook.find({})
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
  res.json(ebooks);
});

// @desc    Get single ebook by ID (Admin only)
// @route   GET /api/ebooks/admin/:id
// @access  Private/Admin
const getEbookById = asyncHandler(async (req, res) => {
  const ebook = await Ebook.findById(req.params.id)
    .populate('author', 'name email');

  if (ebook) {
    res.json(ebook);
  } else {
    res.status(404);
    throw new Error('E-book not found');
  }
});

// @desc    Update an ebook
// @route   PUT /api/ebooks/admin/:id
// @access  Private/Admin
const updateEbook = asyncHandler(async (req, res) => {
  const { title, description, price, isFree, category } = req.body;

  const ebook = await Ebook.findById(req.params.id);

  if (!ebook) {
    res.status(404);
    throw new Error('E-book not found');
  }

  let updateData = {
    title: title || ebook.title,
    description: description || ebook.description,
    price: price !== undefined ? price : ebook.price,
    isFree: isFree !== undefined ? isFree : ebook.isFree,
    category: category || ebook.category,
  };

  // Upload new cover image if provided
  if (req.files && req.files.coverImage) {
    // Delete old cover image from Cloudinary if it's not the default
    if (ebook.coverImage && !ebook.coverImage.includes('/images/sample-ebook-cover.jpg')) {
      const publicId = ebook.coverImage.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`ebook-covers/${publicId}`);
      } catch (error) {
        console.log('Error deleting old cover image:', error);
      }
    }

    const result = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
      folder: 'ebook-covers',
      width: 300,
      height: 400,
      crop: 'fill',
    });
    updateData.coverImage = result.secure_url;
  }

  // Upload new ebook file if provided
  if (req.files && req.files.ebook) {
    // Delete old ebook file from Cloudinary if exists
    if (ebook.fileUrl) {
      const publicId = ebook.fileUrl.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`ebooks/${publicId}`);
      } catch (error) {
        console.log('Error deleting old ebook file:', error);
      }
    }

    const result = await cloudinary.uploader.upload(req.files.ebook[0].path, {
      folder: 'ebooks',
      resource_type: 'auto',
    });
    updateData.fileUrl = result.secure_url;
  }

  const updatedEbook = await Ebook.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json(updatedEbook);
});

// @desc    Delete an ebook
// @route   DELETE /api/ebooks/admin/:id
// @access  Private/Admin
const deleteEbook = asyncHandler(async (req, res) => {
  const ebook = await Ebook.findById(req.params.id);

  if (ebook) {
    // Delete ebook file from Cloudinary if exists
    if (ebook.fileUrl) {
      const filePublicId = ebook.fileUrl.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`ebooks/${filePublicId}`);
      } catch (error) {
        console.log('Error deleting ebook file:', error);
      }
    }

    // Delete cover image from Cloudinary if it's not the default
    if (ebook.coverImage && !ebook.coverImage.includes('/images/sample-ebook-cover.jpg')) {
      const coverPublicId = ebook.coverImage.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`ebook-covers/${coverPublicId}`);
      } catch (error) {
        console.log('Error deleting cover image:', error);
      }
    }

    await ebook.deleteOne();
    res.json({ message: 'E-book removed successfully' });
  } else {
    res.status(404);
    throw new Error('E-book not found');
  }
});

// @desc    Get all ebooks for public/student
// @route   GET /api/ebooks
// @access  Public
const getAllEbooksPublic = asyncHandler(async (req, res) => {
  const ebooks = await Ebook.find({ isActive: true })
    .populate('author', 'name bio avatar')
    .select('-fileUrl') // Don't include fileUrl in public listing for security
    .sort({ isFeatured: -1, createdAt: -1 }); // Featured first, then newest

  // Add virtual fields to response
  const ebooksWithVirtuals = ebooks.map(ebook => {
    const ebookObj = ebook.toObject();
    return {
      ...ebookObj,
      discountPercentage: ebook.discountPercentage
    };
  });

  res.json(ebooksWithVirtuals);
});

// @desc    Get single ebook by ID for public/student with content locking
// @route   GET /api/ebooks/:id
// @access  Public (with optional authentication)
const getEbookByIdPublic = asyncHandler(async (req, res) => {
  const ebook = await Ebook.findById(req.params.id)
    .populate('author', 'name bio avatar');

  if (!ebook) {
    res.status(404);
    throw new Error('E-book not found');
  }

  let userHasPurchased = false;

  // If user is logged in, check if they've purchased this ebook
  if (req.user) {
    const order = await Order.findOne({
      user: req.user._id,
      ebook: ebook._id,
      isPaid: true,
    });

    if (order) {
      userHasPurchased = true;
    }
  }

  // Prepare response data with all fields
  const responseData = {
    _id: ebook._id,
    title: ebook.title,
    description: ebook.description,
    fullDescription: ebook.fullDescription,
    price: ebook.price,
    originalPrice: ebook.originalPrice,
    coverImage: ebook.coverImage,
    isFree: ebook.isFree,
    category: ebook.category,
    language: ebook.language,
    pages: ebook.pages,
    fileSize: ebook.fileSize,
    format: ebook.format,
    isbn: ebook.isbn,
    publishedDate: ebook.publishedDate,
    tags: ebook.tags,
    author: ebook.author,
    rating: ebook.rating,
    totalRatings: ebook.totalRatings,
    totalDownloads: ebook.totalDownloads,
    discountPercentage: ebook.discountPercentage,
    isFeatured: ebook.isFeatured,
    hasPurchased: userHasPurchased,
    createdAt: ebook.createdAt,
    updatedAt: ebook.updatedAt,
  };

  // If ebook is free or user has purchased, include download URL
  if (ebook.isFree || userHasPurchased) {
    responseData.downloadUrl = ebook.fileUrl;
  }

  // Include preview URL if available
  if (ebook.previewUrl) {
    responseData.previewUrl = ebook.previewUrl;
  }

  res.json(responseData);
});

module.exports = {
  createEbook,
  getAllEbooks,
  getEbookById,
  updateEbook,
  deleteEbook,
  getAllEbooksPublic,
  getEbookByIdPublic,
};