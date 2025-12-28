const mongoose = require('mongoose');

const currentAffairSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  detailedContent: {
    type: String,
    required: [true, 'Detailed content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Polity',
      'Economy',
      'Environment',
      'Science & Technology',
      'International',
      'National',
      'State Affairs',
      'Sports',
      'Awards & Honors',
      'Miscellaneous'
    ],
    default: 'Miscellaneous'
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },

  // Package association - NEW
  packages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CurrentAffairsPackage'
  }],

  // Content access control - NEW
  accessType: {
    type: String,
    enum: ['free', 'premium', 'trial'],
    default: 'premium'
  },

  // Content priority and scheduling - NEW
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  scheduledPublishDate: {
    type: Date,
    default: Date.now
  },

  // Enhanced content fields - NEW
  summary: {
    type: String,
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  keyPoints: [{
    type: String,
    trim: true
  }],

  // Media attachments - NEW
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  attachments: [{
    name: String,
    url: String,
    type: String, // pdf, doc, etc.
    size: Number
  }],

  // Language support - NEW
  language: {
    type: String,
    enum: ['English', 'Hindi', 'Both'],
    default: 'English'
  },

  // Content in different languages - NEW
  translations: {
    hindi: {
      title: String,
      description: String,
      detailedContent: String,
      summary: String,
      keyPoints: [String]
    }
  },

  isPublished: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  relatedExams: [{
    type: String,
    enum: ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Defense', 'Teaching', 'Others']
  }],
  source: {
    type: String,
    trim: true
  },
  sourceUrl: { // NEW
    type: String,
    trim: true
  },
  importanceLevel: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },

  // Analytics - ENHANCED
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },

  // User engagement - NEW
  userInteractions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      enum: ['view', 'like', 'share', 'bookmark', 'comment']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Comments system - NEW
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // SEO fields - NEW
  metaTitle: String,
  metaDescription: String,
  slug: {
    type: String,
    unique: true,
    sparse: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Changed from 'Admin' to 'User'
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Changed from 'Admin' to 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-set month and year before saving
currentAffairSchema.pre('save', function (next) {
  const date = new Date(this.date);
  this.month = date.toLocaleString('default', { month: 'long' });
  this.year = date.getFullYear();

  // Auto-generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  next();
});

// Virtual for formatted date
currentAffairSchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for reading time
currentAffairSchema.virtual('estimatedReadTime').get(function () {
  if (this.detailedContent) {
    const wordsPerMinute = 200;
    const wordCount = this.detailedContent.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
  return this.readTime || 5;
});

// Index for efficient queries
currentAffairSchema.index({ date: -1, category: 1 });
currentAffairSchema.index({ isPublished: 1, date: -1 });
currentAffairSchema.index({ title: 'text', description: 'text', tags: 'text' });
currentAffairSchema.index({ packages: 1, accessType: 1 });
currentAffairSchema.index({ scheduledPublishDate: 1, isPublished: 1 });
currentAffairSchema.index({ slug: 1 });
currentAffairSchema.index({ language: 1, accessType: 1 });

module.exports = mongoose.model('CurrentAffair', currentAffairSchema);