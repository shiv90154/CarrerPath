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
    // SEO fields
    slug: {
      type: String,
      unique: true,
      sparse: true
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
CourseSchema.pre('save', async function (next) {
  // Auto-generate unique slug if not provided
  if (!this.slug && this.title) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);

    let slug = baseSlug;
    let counter = 1;

    // Check if slug already exists and make it unique
    while (true) {
      const existingCourse = await mongoose.model('Course').findOne({
        slug: slug,
        _id: { $ne: this._id } // Exclude current document if updating
      });

      if (!existingCourse) {
        break; // Slug is unique
      }

      // Generate new slug with counter
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  next();
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;

