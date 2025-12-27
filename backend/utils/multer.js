const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for study materials
const fileFilterForStudyMaterial = (req, file, cb) => {
  // For study material files
  if (file.fieldname === 'materialFile') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for study materials'), false);
    }
  }
  // For cover images
  else if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for cover'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const uploadStudyMaterial = multer({
  storage: storage,
  fileFilter: fileFilterForStudyMaterial,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  }
});

// For ebooks (keep existing)
const fileFilterForEbook = (req, file, cb) => {
  if (file.fieldname === 'ebook') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for ebooks'), false);
    }
  }
  else if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for cover'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const uploadEbook = multer({
  storage: storage,
  fileFilter: fileFilterForEbook,
  limits: {
    fileSize: 50 * 1024 * 1024,
  }
});

module.exports = {
  uploadEbook,
  uploadStudyMaterial,
  upload: uploadEbook, // Default export for backward compatibility
};