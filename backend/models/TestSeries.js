const mongoose = require('mongoose');

const TestSeriesSchema = mongoose.Schema(
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
    image: {
      type: String,
      required: true,
      default: '/images/sample.jpg',
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    duration: {
      type: String, // e.g., "30 days", "2 months"
      required: true,
    },
    language: {
      type: String,
      default: 'English',
    },
    tags: [String],
    requirements: [String],
    whatYouWillLearn: [String],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    // Hierarchical content structure for Test Series
    // TestSeries → Categories → Subcategories → Tests
    content: [{
      categoryName: {
        type: String,
        required: true, // e.g., "General Studies", "Mathematics", "Reasoning"
      },
      categoryDescription: {
        type: String,
        default: ''
      },
      subcategories: [{
        subcategoryName: {
          type: String,
          required: true, // e.g., "History", "Geography", "Current Affairs"
        },
        subcategoryDescription: {
          type: String,
          default: ''
        },
        tests: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Test',
        }],
        liveTests: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LiveTest',
        }]
      }],
      // For categories without subcategories, tests go directly here
      tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
      }],
      liveTests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveTest',
      }]
    }],

    // Legacy support - keep existing tests array for backward compatibility
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
      },
    ],
    liveTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveTest',
      },
    ],
    totalTests: {
      type: Number,
      default: 0,
    },
    totalLiveTests: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    enrolledStudents: {
      type: Number,
      default: 0,
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
    validityPeriod: {
      type: Number, // in days
      default: 365,
    },
    // Test Series specific features
    hasLiveTests: {
      type: Boolean,
      default: false,
    },
    liveTestSchedule: {
      type: String, // e.g., "Every Sunday 10 AM"
      default: ''
    },
    resultAnalysis: {
      type: Boolean,
      default: true,
    },
    rankingSystem: {
      type: Boolean,
      default: true,
    },
    solutionAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for discount percentage
TestSeriesSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Update totalTests when tests array changes
TestSeriesSchema.pre('save', function (next) {
  this.totalTests = this.tests.length;
  this.totalLiveTests = this.liveTests.length;

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

const TestSeries = mongoose.model('TestSeries', TestSeriesSchema);

module.exports = TestSeries;

