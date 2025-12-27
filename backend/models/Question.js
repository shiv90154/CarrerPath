const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true, default: false },
    },
  ],
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
  },
  liveTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveTest',
  },
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;

