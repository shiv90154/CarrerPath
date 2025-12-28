const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema(
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
      type: String, // e.g., "10 hours", "3 months"
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
    // Course content organized in hierarchical structure
    // Course → Categories → Subcategories → Videos
    content: [{
      categoryName: {
        type: String,
        required: true, // e.g., "General Studies", "Himachal GK", "English"
      },
      categoryDescription: {
        type: String,
        default: ''
      },
      subcategories: [{
        subcategoryName: {
          type: String,
          required: true, // e.g., "History", "Geography", "Indian Polity"
        },
        subcategoryDescription: {
          type: String,
          default: ''
        },
        videos: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Video',
        }]
      }],
      // For categories without subcategories, videos go directly here
      videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      }]
    }],

    // Legacy support - keep existing videos array for backward compatibility
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    totalVideos: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: String,
      default: '0 min',
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for discount percentage
CourseSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Update totalVideos when videos array changes
CourseSchema.pre('save', function (next) {
  this.totalVideos = this.videos.length;
  next();
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;

