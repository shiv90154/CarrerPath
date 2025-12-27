const mongoose = require('mongoose');

const VideoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: String, // e.g., "15:30"
      default: '0:00',
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    isFree: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    views: {
      type: Number,
      default: 0,
    },
    isActive: {
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

// Index for efficient queries
VideoSchema.index({ course: 1, order: 1 });
VideoSchema.index({ isFree: 1, isActive: 1 });

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;

