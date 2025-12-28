const mongoose = require('mongoose');

const TestSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    testSeries: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestSeries',
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    duration: {
      type: Number, // in minutes
      required: true,
      default: 60,
    },
    passMark: {
      type: Number,
      required: true,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    negativeMarking: {
      type: Number, // e.g., 0.25 for -0.25 per wrong answer
      default: 0,
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
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    instructions: {
      type: String,
      default: '',
    },
    // Test scheduling
    isScheduled: {
      type: Boolean,
      default: false,
    },
    scheduledStartTime: {
      type: Date,
    },
    scheduledEndTime: {
      type: Date,
    },
    // Test features
    showResultImmediately: {
      type: Boolean,
      default: true,
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true,
    },
    allowReview: {
      type: Boolean,
      default: true,
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    shuffleOptions: {
      type: Boolean,
      default: false,
    },
    maxAttempts: {
      type: Number,
      default: 1,
    },
    // Analytics
    totalAttempts: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    lowestScore: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 1,
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

// Virtual for total questions count
TestSchema.virtual('totalQuestions').get(function () {
  return this.questions.length;
});

// Virtual for marks per question
TestSchema.virtual('marksPerQuestion').get(function () {
  return this.questions.length > 0 ? this.totalMarks / this.questions.length : 0;
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;

