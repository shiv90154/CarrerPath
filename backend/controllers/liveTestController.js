const asyncHandler = require('express-async-handler');
const LiveTest = require('../models/LiveTest');
const Question = require('../models/Question');

// @desc    Create a new live test
// @route   POST /api/livetests/admin
// @access  Private/Admin
const createLiveTest = asyncHandler(async (req, res) => {
  const { title, description, startTime, endTime, duration, questions } = req.body;

  const liveTest = new LiveTest({
    title,
    description,
    startTime,
    endTime,
    duration,
    instructor: req.user._id,
  });

  const createdLiveTest = await liveTest.save();

  if (questions && questions.length > 0) {
    for (const questionData of questions) {
      const newQuestion = new Question({
        questionText: questionData.questionText,
        options: questionData.options,
        liveTest: createdLiveTest._id,
      });
      const savedQuestion = await newQuestion.save();
      createdLiveTest.questions.push(savedQuestion._id);
    }
    await createdLiveTest.save();
  }

  res.status(201).json(createdLiveTest);
});

// @desc    Get all live tests (Admin only)
// @route   GET /api/livetests/admin
// @access  Private/Admin
const getAllLiveTests = asyncHandler(async (req, res) => {
  const liveTests = await LiveTest.find({}).populate('instructor', 'name email');
  res.json(liveTests);
});

// @desc    Get single live test by ID (Admin only)
// @route   GET /api/livetests/admin/:id
// @access  Private/Admin
const getLiveTestById = asyncHandler(async (req, res) => {
  const liveTest = await LiveTest.findById(req.params.id)
    .populate('instructor', 'name email')
    .populate('questions');

  if (liveTest) {
    res.json(liveTest);
  } else {
    res.status(404);
    throw new Error('Live Test not found');
  }
});

// @desc    Update a live test
// @route   PUT /api/livetests/admin/:id
// @access  Private/Admin
const updateLiveTest = asyncHandler(async (req, res) => {
  const { title, description, startTime, endTime, duration } = req.body;

  const liveTest = await LiveTest.findById(req.params.id);

  if (liveTest) {
    liveTest.title = title || liveTest.title;
    liveTest.description = description || liveTest.description;
    liveTest.startTime = startTime || liveTest.startTime;
    liveTest.endTime = endTime || liveTest.endTime;
    liveTest.duration = duration || liveTest.duration;

    const updatedLiveTest = await liveTest.save();
    res.json(updatedLiveTest);
  } else {
    res.status(404);
    throw new Error('Live Test not found');
  }
});

// @desc    Delete a live test
// @route   DELETE /api/livetests/admin/:id
// @access  Private/Admin
const deleteLiveTest = asyncHandler(async (req, res) => {
  const liveTest = await LiveTest.findById(req.params.id);

  if (liveTest) {
    // TODO: Delete associated questions
    await liveTest.deleteOne();
    res.json({ message: 'Live Test removed' });
  } else {
    res.status(404);
    throw new Error('Live Test not found');
  }
});

// @desc    Create a new question for a live test
// @route   POST /api/livetests/admin/:liveTestId/questions
// @access  Private/Admin
const createLiveTestQuestion = asyncHandler(async (req, res) => {
  const { questionText, options } = req.body;
  const { liveTestId } = req.params;

  const liveTest = await LiveTest.findById(liveTestId);

  if (!liveTest) {
    res.status(404);
    throw new Error('Live Test not found');
  }

  const question = new Question({
    questionText,
    options,
    liveTest: liveTestId,
  });

  const createdQuestion = await question.save();

  liveTest.questions.push(createdQuestion._id);
  await liveTest.save();

  res.status(201).json(createdQuestion);
});

// @desc    Update a question for a live test
// @route   PUT /api/livetests/admin/:liveTestId/questions/:questionId
// @access  Private/Admin
const updateLiveTestQuestion = asyncHandler(async (req, res) => {
  const { questionText, options } = req.body;
  const { questionId } = req.params;

  const question = await Question.findById(questionId);

  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  question.questionText = questionText || question.questionText;
  question.options = options || question.options; // TODO: Handle individual option updates

  const updatedQuestion = await question.save();
  res.json(updatedQuestion);
});

// @desc    Delete a question for a live test
// @route   DELETE /api/livetests/admin/:liveTestId/questions/:questionId
// @access  Private/Admin
const deleteLiveTestQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  const question = await Question.findById(questionId);

  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  await question.deleteOne();
  res.json({ message: 'Question removed' });
});

// @desc    Get public live tests (for students)
// @route   GET /api/livetests
// @access  Public
const getPublicLiveTests = asyncHandler(async (req, res) => {
  const now = new Date();
  const liveTests = await LiveTest.find({
    isActive: true,
    startTime: { $gte: now }
  })
    .populate('instructor', 'name')
    .select('-questions')
    .sort({ startTime: 1 });

  res.json(liveTests);
});

// @desc    Join a live test
// @route   POST /api/livetests/:id/join
// @access  Private
const joinLiveTest = asyncHandler(async (req, res) => {
  const liveTest = await LiveTest.findById(req.params.id)
    .populate('questions');

  if (!liveTest) {
    res.status(404);
    throw new Error('Live Test not found');
  }

  const now = new Date();

  // Check if test is active and within time window
  if (!liveTest.isActive) {
    res.status(400);
    throw new Error('Live test is not active');
  }

  if (now < liveTest.startTime) {
    res.status(400);
    throw new Error('Live test has not started yet');
  }

  if (now > liveTest.endTime) {
    res.status(400);
    throw new Error('Live test has ended');
  }

  // Add user to participants if not already joined
  if (!liveTest.participants.includes(req.user._id)) {
    liveTest.participants.push(req.user._id);
    await liveTest.save();
  }

  res.json({
    message: 'Successfully joined live test',
    liveTest: {
      _id: liveTest._id,
      title: liveTest.title,
      description: liveTest.description,
      duration: liveTest.duration,
      questions: liveTest.questions,
      startTime: liveTest.startTime,
      endTime: liveTest.endTime
    }
  });
});

// @desc    Submit live test answers
// @route   POST /api/livetests/:id/submit
// @access  Private
const submitLiveTestAnswers = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const liveTest = await LiveTest.findById(req.params.id)
    .populate('questions');

  if (!liveTest) {
    res.status(404);
    throw new Error('Live Test not found');
  }

  const now = new Date();

  // Check if test is still active
  if (now > liveTest.endTime) {
    res.status(400);
    throw new Error('Live test has ended');
  }

  // Check if user has joined the test
  if (!liveTest.participants.includes(req.user._id)) {
    res.status(400);
    throw new Error('You must join the test first');
  }

  // Calculate score
  let score = 0;
  const evaluatedAnswers = answers.map((ans) => {
    const question = liveTest.questions.find((q) => q._id.toString() === ans.question.toString());
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

  // Create result using the existing Result model
  const Result = require('../models/Result');
  const result = new Result({
    user: req.user._id,
    liveTest: liveTest._id,
    score,
    totalQuestions: liveTest.questions.length,
    percentage: Math.round((score / liveTest.questions.length) * 100),
    answers: evaluatedAnswers,
    timeTaken: req.body.timeTaken || liveTest.duration
  });

  await result.save();

  res.json({
    message: 'Answers submitted successfully',
    result: {
      score,
      totalQuestions: liveTest.questions.length,
      percentage: result.percentage,
      timeTaken: result.timeTaken
    }
  });
});

module.exports = {
  createLiveTest,
  getAllLiveTests,
  getLiveTestById,
  updateLiveTest,
  deleteLiveTest,
  createLiveTestQuestion,
  updateLiveTestQuestion,
  deleteLiveTestQuestion,
  getPublicLiveTests,
  joinLiveTest,
  submitLiveTestAnswers,
};

