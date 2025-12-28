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

    // Hierarchical content structure for E-books
    // Ebook → Categories → Subcategories → Books/Chapters
    content: [{
      categoryName: {
        type: String,
        required: true, // e.g., "NCERT Books", "Reference Books", "Previous Year Papers"
      },
      categoryDescription: {
        type: String,
        default: ''
      },
      subcategories: [{
        subcategoryName: {
          type: String,
          required: true, // e.g., "Class 11", "Class 12", "History", "Geography"
        },
        subcategoryDescription: {
          type: String,
          default: ''
        },
        books: [{
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            default: ''
          },
          fileUrl: {
            type: String,
            required: true,
          },
          previewUrl: {
            type: String, // URL for preview/sample pages
          },
          coverImage: {
            type: String,
            default: ''
          },
          pages: {
            type: Number,
            default: 0,
          },
          fileSize: {
            type: String, // e.g., "2.5 MB"
            default: ''
          },
          format: {
            type: String,
            enum: ['PDF', 'EPUB', 'MOBI'],
            default: 'PDF',
          },
          isFree: {
            type: Boolean,
            default: false,
          },
          hasPreview: {
            type: Boolean,
            default: true,
          },
          previewPages: {
            type: Number,
            default: 10, // Number of preview pages
          },
          order: {
            type: Number,
            default: 1,
          }
        }]
      }],
      // For categories without subcategories, books go directly here
      books: [{
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: ''
        },
        fileUrl: {
          type: String,
          required: true,
        },
        previewUrl: {
          type: String, // URL for preview/sample pages
        },
        coverImage: {
          type: String,
          default: ''
        },
        pages: {
          type: Number,
          default: 0,
        },
        fileSize: {
          type: String, // e.g., "2.5 MB"
          default: ''
        },
        format: {
          type: String,
          enum: ['PDF', 'EPUB', 'MOBI'],
          default: 'PDF',
        },
        isFree: {
          type: Boolean,
          default: false,
        },
        hasPreview: {
          type: Boolean,
          default: true,
        },
        previewPages: {
          type: Number,
          default: 10, // Number of preview pages
        },
        order: {
          type: Number,
          default: 1,
        }
      }]
    }],

    // Legacy support - keep existing fields for backward compatibility
    fileUrl: {
      type: String,
      required: false, // Made optional for hierarchical structure
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
      required: false, // Made optional for hierarchical structure
    },
    fileSize: {
      type: String, // e.g., "2.5 MB"
      required: false, // Made optional for hierarchical structure
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
    totalBooks: {
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
    // SEO fields
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    // E-book specific features
    hasPreviewSample: {
      type: Boolean,
      default: true,
    },
    previewPages: {
      type: Number,
      default: 10, // Number of preview pages for the collection
    },
    downloadLimit: {
      type: Number,
      default: 3, // Number of times user can download
    },
    watermarkEnabled: {
      type: Boolean,
      default: true,
    },
    printingAllowed: {
      type: Boolean,
      default: false,
    },
    offlineAccess: {
      type: Boolean,
      default: true,
    },
    validityPeriod: {
      type: Number, // in days, 0 means lifetime access
      default: 0,
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

// Update totalBooks when content changes
EbookSchema.pre('save', function (next) {
  let totalBooks = 0;
  if (this.content && this.content.length > 0) {
    this.content.forEach(category => {
      totalBooks += category.books.length;
      category.subcategories.forEach(subcategory => {
        totalBooks += subcategory.books.length;
      });
    });
  }
  this.totalBooks = totalBooks;

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

const Ebook = mongoose.model('Ebook', EbookSchema);

module.exports = Ebook;

