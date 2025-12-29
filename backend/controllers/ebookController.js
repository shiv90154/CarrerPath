const asyncHandler = require('express-async-handler');
const Ebook = require('../models/Ebook');
const cloudinary = require('../utils/cloudinary');
const Order = require('../models/Order');

// @desc    Create a new ebook
// @route   POST /api/ebooks/admin
// @access  Private/Admin
const createEbook = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const {
    title,
    description,
    fullDescription,
    price,
    originalPrice,
    category,
    language,
    tags,
    isbn,
    content, // New hierarchical content structure
    hasPreviewSample,
    previewPages,
    downloadLimit,
    watermarkEnabled,
    printingAllowed,
    offlineAccess,
    validityPeriod
  } = req.body;

  if (!title || !price || !category || !fullDescription) {
    res.status(400);
    throw new Error("Title, price, category and full description are required");
  }

  let coverImageUrl = '/images/sample-ebook-cover.jpg'; // Default cover image

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
    fullDescription,
    price,
    originalPrice: originalPrice || price,
    coverImage: coverImageUrl,
    category,
    language: language || 'English',
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
    isbn,
    content: content || [], // Initialize with hierarchical content structure
    hasPreviewSample: hasPreviewSample !== undefined ? hasPreviewSample : true,
    previewPages: previewPages || 10,
    downloadLimit: downloadLimit || 3,
    watermarkEnabled: watermarkEnabled !== undefined ? watermarkEnabled : true,
    printingAllowed: printingAllowed !== undefined ? printingAllowed : false,
    offlineAccess: offlineAccess !== undefined ? offlineAccess : true,
    validityPeriod: validityPeriod || 0,
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
  const {
    title,
    description,
    fullDescription,
    price,
    originalPrice,
    category,
    language,
    tags,
    isbn,
    content, // New hierarchical content structure
    hasPreviewSample,
    previewPages,
    downloadLimit,
    watermarkEnabled,
    printingAllowed,
    offlineAccess,
    validityPeriod,
    isActive,
    isFeatured
  } = req.body;

  const ebook = await Ebook.findById(req.params.id);

  if (!ebook) {
    res.status(404);
    throw new Error('E-book not found');
  }

  let updateData = {
    title: title || ebook.title,
    description: description || ebook.description,
    fullDescription: fullDescription || ebook.fullDescription,
    price: price !== undefined ? price : ebook.price,
    originalPrice: originalPrice !== undefined ? originalPrice : ebook.originalPrice,
    category: category || ebook.category,
    language: language || ebook.language,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : ebook.tags,
    isbn: isbn || ebook.isbn,
    hasPreviewSample: hasPreviewSample !== undefined ? hasPreviewSample : ebook.hasPreviewSample,
    previewPages: previewPages !== undefined ? previewPages : ebook.previewPages,
    downloadLimit: downloadLimit !== undefined ? downloadLimit : ebook.downloadLimit,
    watermarkEnabled: watermarkEnabled !== undefined ? watermarkEnabled : ebook.watermarkEnabled,
    printingAllowed: printingAllowed !== undefined ? printingAllowed : ebook.printingAllowed,
    offlineAccess: offlineAccess !== undefined ? offlineAccess : ebook.offlineAccess,
    validityPeriod: validityPeriod !== undefined ? validityPeriod : ebook.validityPeriod,
    isActive: isActive !== undefined ? isActive : ebook.isActive,
    isFeatured: isFeatured !== undefined ? isFeatured : ebook.isFeatured,
  };

  // Update hierarchical content structure if provided
  if (content) {
    updateData.content = content;
  }

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
  const ebooksWithVirtuals = ebooks
    .filter(ebook => ebook) // Filter out null ebooks
    .map(ebook => {
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

  if (!ebook || !ebook.isActive) {
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
    totalBooks: ebook.totalBooks,
    discountPercentage: ebook.discountPercentage,
    isFeatured: ebook.isFeatured,
    hasPreviewSample: ebook.hasPreviewSample,
    previewPages: ebook.previewPages,
    downloadLimit: ebook.downloadLimit,
    watermarkEnabled: ebook.watermarkEnabled,
    printingAllowed: ebook.printingAllowed,
    offlineAccess: ebook.offlineAccess,
    validityPeriod: ebook.validityPeriod,
    hasPurchased: userHasPurchased,
    createdAt: ebook.createdAt,
    updatedAt: ebook.updatedAt,
  };

  // Handle hierarchical content structure
  if (ebook.content && ebook.content.length > 0) {
    if (userHasPurchased || ebook.isFree) {
      // Full access - include all books with download URLs
      responseData.content = ebook.content
        .filter(category => category) // Filter out null categories
        .map(category => ({
          ...category.toObject(),
          subcategories: category.subcategories
            .filter(subcategory => subcategory) // Filter out null subcategories
            .map(subcategory => ({
              ...subcategory.toObject(),
              books: subcategory.books
                .filter(book => book) // Filter out null books
                .map(book => ({
                  ...book.toObject(),
                  downloadUrl: book.fileUrl,
                  canDownload: true
                }))
            })),
          books: category.books
            .filter(book => book) // Filter out null books
            .map(book => ({
              ...book.toObject(),
              downloadUrl: book.fileUrl,
              canDownload: true
            }))
        }));
      responseData.accessType = 'full';
    } else {
      // Limited access - show preview samples only
      const filteredContent = ebook.content
        .filter(category => category) // Filter out null categories
        .map(category => ({
          ...category.toObject(),
          subcategories: category.subcategories
            .filter(subcategory => subcategory) // Filter out null subcategories
            .map(subcategory => ({
              ...subcategory.toObject(),
              books: subcategory.books
                .filter(book => book) // Filter out null books
                .map(book => ({
                  ...book.toObject(),
                  downloadUrl: book.isFree ? book.fileUrl : null,
                  previewUrl: book.hasPreview ? book.previewUrl : null,
                  canDownload: book.isFree,
                  isPreviewOnly: !book.isFree
                }))
            })),
          books: category.books
            .filter(book => book) // Filter out null books
            .map(book => ({
              ...book.toObject(),
              downloadUrl: book.isFree ? book.fileUrl : null,
              previewUrl: book.hasPreview ? book.previewUrl : null,
              canDownload: book.isFree,
              isPreviewOnly: !book.isFree
            }))
        }));

      responseData.content = filteredContent;
      responseData.accessType = 'limited';

      // Calculate total locked books
      let totalLockedBooks = 0;
      ebook.content.forEach(category => {
        totalLockedBooks += category.books.filter(book => !book.isFree).length;
        category.subcategories.forEach(subcategory => {
          totalLockedBooks += subcategory.books.filter(book => !book.isFree).length;
        });
      });
      responseData.totalLockedBooks = totalLockedBooks;
    }
  } else {
    // Fallback to legacy structure
    if (ebook.isFree || userHasPurchased) {
      responseData.downloadUrl = ebook.fileUrl;
      responseData.canDownload = true;
    }

    // Include preview URL if available
    if (ebook.previewUrl) {
      responseData.previewUrl = ebook.previewUrl;
    }

    responseData.accessType = (ebook.isFree || userHasPurchased) ? 'full' : 'limited';
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