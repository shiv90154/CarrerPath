const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      required: true,
      enum: ['UPSC', 'SSC', 'Banking', 'State Exams', 'Railway', 'Defense', 'Teaching', 'Other'],
    },
    subject: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Free', 'Paid'],
      default: 'Free',
    },
    price: {
      type: Number,
      required: function() {
        return this.type === 'Paid';
      },
      default: 0,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: '/images/default-paper-cover.jpg',
    },
    pages: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'English',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add index for better performance
StudyMaterialSchema.index({ examType: 1, year: -1 });
StudyMaterialSchema.index({ type: 1, isActive: 1 });

// Virtual for formatted year
StudyMaterialSchema.virtual('formattedYear').get(function() {
  return `${this.year}`;
});

const StudyMaterial = mongoose.model('StudyMaterial', StudyMaterialSchema);

module.exports = StudyMaterial;