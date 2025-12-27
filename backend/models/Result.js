const mongoose = require('mongoose');

const ResultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: false, // Can be null if it's a live test
    },
    liveTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveTest',
      required: false, // Can be null if it's a regular test
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        chosenOption: { type: String },
        isCorrect: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;

