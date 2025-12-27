const mongoose = require('mongoose');

const LiveTestSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    maxParticipants: {
      type: Number,
      default: 1000,
    },
  },
  { timestamps: true }
);

const LiveTest = mongoose.model('LiveTest', LiveTestSchema);

module.exports = LiveTest;

