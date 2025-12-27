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
    isFree: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;

