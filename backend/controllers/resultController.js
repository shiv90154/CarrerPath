const asyncHandler = require('express-async-handler');
const Result = require('../models/Result');
const Test = require('../models/Test');
const LiveTest = require('../models/LiveTest');

// @desc    Submit a test result
// @route   POST /api/results
// @access  Private
const submitTestResult = asyncHandler(async (req, res) => {
  const { testId, liveTestId, answers } = req.body;

  let targetTest = null;
  if (testId) {
    targetTest = await Test.findById(testId).populate('questions');
  } else if (liveTestId) {
    targetTest = await LiveTest.findById(liveTestId).populate('questions');
  }

  if (!targetTest) {
    res.status(404);
    throw new Error('Test or Live Test not found');
  }

  let score = 0;
  const totalQuestions = targetTest.questions.length;

  const evaluatedAnswers = answers.map((ans) => {
    const question = targetTest.questions.find((q) => q._id.toString() === ans.question.toString());
    let isCorrect = false;
    if (question) {
      const correctOption = question.options.find((opt) => opt.isCorrect);
      if (correctOption && correctOption.text === ans.chosenOption) {
        isCorrect = true;
        score++;
      }
    }
    return { ...ans, isCorrect };
  });

  const result = new Result({
    user: req.user._id,
    test: testId || null,
    liveTest: liveTestId || null,
    score,
    totalQuestions,
    answers: evaluatedAnswers,
  });

  const createdResult = await result.save();
  res.status(201).json(createdResult);
});

// @desc    Get logged in user's results
// @route   GET /api/results
// @access  Private
const getMyResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ user: req.user._id })
    .populate('test', 'title')
    .populate('liveTest', 'title');
  res.json(results);
});

// @desc    Get all results (Admin only)
// @route   GET /api/results/admin
// @access  Private/Admin
const getAllResults = asyncHandler(async (req, res) => {
  const results = await Result.find({})
    .populate('user', 'name email')
    .populate('test', 'title')
    .populate('liveTest', 'title');
  res.json(results);
});

module.exports = {
  submitTestResult,
  getMyResults,
  getAllResults,
};

