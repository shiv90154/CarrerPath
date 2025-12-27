const mongoose = require('mongoose');

const EbookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      required: true,
      default: '/images/sample-ebook-cover.jpg',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    previewUrl: {
      type: String, // URL for preview/sample pages
    },
    isFree: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'English',
    },
    pages: {
      type: Number,
      required: true,
    },
    fileSize: {
      type: String, // e.g., "2.5 MB"
      required: true,
    },
    format: {
      type: String,
      enum: ['PDF', 'EPUB', 'MOBI'],
      default: 'PDF',
    },
    isbn: {
      type: String,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalDownloads: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for discount percentage
EbookSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

const Ebook = mongoose.model('Ebook', EbookSchema);

module.exports = Ebook;

