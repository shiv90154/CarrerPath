const asyncHandler = require('express-async-handler');
const TestSeries = require('../models/TestSeries');
const Test = require('../models/Test');
const Question = require('../models/Question');
const Order = require('../models/Order');

// @desc    Create a new test series
// @route   POST /api/testseries/admin
// @access  Private/Admin
const createTestSeries = asyncHandler(async (req, res) => {
  const { title, description, price, image, category, tests } = req.body;

  const testSeries = new TestSeries({
    title,
    description,
    price,
    image: image || '/images/sample.jpg',
    category,
    instructor: req.user._id,
  });

  const createdTestSeries = await testSeries.save();

  // Create and associate tests and questions
  if (tests && tests.length > 0) {
    for (const testData of tests) {
      const newTest = new Test({
        title: testData.title,
        description: testData.description,
        duration: testData.duration,
        passMark: testData.passMark,
        isFree: testData.isFree,
        testSeries: createdTestSeries._id,
      });
      const savedTest = await newTest.save();

      if (testData.questions && testData.questions.length > 0) {
        for (const questionData of testData.questions) {
          const newQuestion = new Question({
            questionText: questionData.questionText,
            options: questionData.options,
            test: savedTest._id,
          });
          const savedQuestion = await newQuestion.save();
          savedTest.questions.push(savedQuestion._id);
        }
        await savedTest.save();
      }
      createdTestSeries.tests.push(savedTest._id);
    }
    await createdTestSeries.save();
  }

  res.status(201).json(createdTestSeries);
});

// @desc    Get all test series (Admin only)
// @route   GET /api/testseries/admin
// @access  Private/Admin
const getAllTestSeries = asyncHandler(async (req, res) => {
  const testSeries = await TestSeries.find({}).populate('instructor', 'name email');
  res.json(testSeries);
});

// @desc    Get single test series by ID (Admin only)
// @route   GET /api/testseries/admin/:id
// @access  Private/Admin
const getTestSeriesById = asyncHandler(async (req, res) => {
  const testSeries = await TestSeries.findById(req.params.id)
    .populate('instructor', 'name email')
    .populate({
      path: 'tests',
      populate: {
        path: 'questions',
      },
    });

  if (testSeries) {
    res.json(testSeries);
  } else {
    res.status(404);
    throw new Error('Test Series not found');
  }
});

// @desc    Update a test series
// @route   PUT /api/testseries/admin/:id
// @access  Private/Admin
const updateTestSeries = asyncHandler(async (req, res) => {
  const { title, description, price, image, category } = req.body;

  const testSeries = await TestSeries.findById(req.params.id);

  if (testSeries) {
    testSeries.title = title || testSeries.title;
    testSeries.description = description || testSeries.description;
    testSeries.price = price || testSeries.price;
    testSeries.image = image || testSeries.image;
    testSeries.category = category || testSeries.category;

    const updatedTestSeries = await testSeries.save();
    res.json(updatedTestSeries);
  } else {
    res.status(404);
    throw new Error('Test Series not found');
  }
});

// @desc    Delete a test series
// @route   DELETE /api/testseries/admin/:id
// @access  Private/Admin
const deleteTestSeries = asyncHandler(async (req, res) => {
  const testSeries = await TestSeries.findById(req.params.id);

  if (testSeries) {
    // TODO: Delete associated tests and questions
    await testSeries.deleteOne();
    res.json({ message: 'Test Series removed' });
  } else {
    res.status(404);
    throw new Error('Test Series not found');
  }
});

// @desc    Create a new test within a test series
// @route   POST /api/testseries/admin/:testSeriesId/tests
// @access  Private/Admin
const createTest = asyncHandler(async (req, res) => {
  const { title, description, duration, passMark, isFree, questions } = req.body;
  const { testSeriesId } = req.params;

  const testSeries = await TestSeries.findById(testSeriesId);

  if (!testSeries) {
    res.status(404);
    throw new Error('Test Series not found');
  }

  const newTest = new Test({
    title,
    description,
    duration,
    passMark,
    isFree,
    testSeries: testSeriesId,
  });

  const savedTest = await newTest.save();

  if (questions && questions.length > 0) {
    for (const questionData of questions) {
      const newQuestion = new Question({
        questionText: questionData.questionText,
        options: questionData.options,
        test: savedTest._id,
      });
      const savedQuestion = await newQuestion.save();
      savedTest.questions.push(savedQuestion._id);
    }
    await savedTest.save();
  }

  testSeries.tests.push(savedTest._id);
  await testSeries.save();

  res.status(201).json(savedTest);
});

// @desc    Update a test within a test series
// @route   PUT /api/testseries/admin/:testSeriesId/tests/:testId
// @access  Private/Admin
const updateTest = asyncHandler(async (req, res) => {
  const { title, description, duration, passMark, isFree, questions } = req.body;
  const { testId } = req.params;

  const test = await Test.findById(testId);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  test.title = title || test.title;
  test.description = description || test.description;
  test.duration = duration || test.duration;
  test.passMark = passMark || test.passMark;
  test.isFree = isFree !== undefined ? isFree : test.isFree;

  const updatedTest = await test.save();

  // TODO: Handle updates/deletions of questions within the test

  res.json(updatedTest);
});

// @desc    Delete a test within a test series
// @route   DELETE /api/testseries/admin/:testSeriesId/tests/:testId
// @access  Private/Admin
const deleteTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const test = await Test.findById(testId);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // TODO: Delete associated questions
  await test.deleteOne();
  res.json({ message: 'Test removed' });
});

// @desc    Create a new question within a test
// @route   POST /api/testseries/admin/:testSeriesId/tests/:testId/questions
// @access  Private/Admin
const createQuestion = asyncHandler(async (req, res) => {
  const { questionText, options } = req.body;
  const { testId } = req.params;

  const test = await Test.findById(testId);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  const question = new Question({
    questionText,
    options,
    test: testId,
  });

  const createdQuestion = await question.save();

  test.questions.push(createdQuestion._id);
  await test.save();

  res.status(201).json(createdQuestion);
});

// @desc    Update a question within a test
// @route   PUT /api/testseries/admin/:testSeriesId/tests/:testId/questions/:questionId
// @access  Private/Admin
const updateQuestion = asyncHandler(async (req, res) => {
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

// @desc    Delete a question within a test
// @route   DELETE /api/testseries/admin/:testSeriesId/tests/:testId/questions/:questionId
// @access  Private/Admin
const deleteQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  const question = await Question.findById(questionId);

  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  await question.deleteOne();
  res.json({ message: 'Question removed' });
});

// @desc    Get all test series for public/student
// @route   GET /api/testseries
// @access  Public
const getAllTestSeriesPublic = asyncHandler(async (req, res) => {
  const testSeries = await TestSeries.find({ isActive: true })
    .populate('instructor', 'name bio avatar')
    .sort({ isFeatured: -1, createdAt: -1 }); // Featured first, then newest

  // Add virtual fields to response
  const testSeriesWithVirtuals = testSeries.map(series => {
    const seriesObj = series.toObject();
    return {
      ...seriesObj,
      discountPercentage: series.discountPercentage
    };
  });

  res.json(testSeriesWithVirtuals);
});

// @desc    Get single test series by ID for public/student with content locking
// @route   GET /api/testseries/:id
// @access  Public (with optional authentication)
const getTestSeriesByIdPublic = asyncHandler(async (req, res) => {
  const testSeries = await TestSeries.findById(req.params.id)
    .populate('instructor', 'name bio avatar')
    .populate({
      path: 'tests',
      populate: {
        path: 'questions',
      },
    });

  if (!testSeries) {
    res.status(404);
    throw new Error('Test Series not found');
  }

  let userHasPurchased = false;

  // If user is logged in, check if they've purchased this test series
  if (req.user) {
    const order = await Order.findOne({
      user: req.user._id,
      testSeries: testSeries._id,
      isPaid: true,
    });

    if (order) {
      userHasPurchased = true;
    }
  }

  // Prepare response data with all fields
  const responseData = {
    _id: testSeries._id,
    title: testSeries.title,
    description: testSeries.description,
    fullDescription: testSeries.fullDescription,
    price: testSeries.price,
    originalPrice: testSeries.originalPrice,
    image: testSeries.image,
    category: testSeries.category,
    level: testSeries.level,
    duration: testSeries.duration,
    language: testSeries.language,
    tags: testSeries.tags,
    requirements: testSeries.requirements,
    whatYouWillLearn: testSeries.whatYouWillLearn,
    instructor: testSeries.instructor,
    totalTests: testSeries.totalTests,
    totalQuestions: testSeries.totalQuestions,
    enrolledStudents: testSeries.enrolledStudents,
    rating: testSeries.rating,
    totalRatings: testSeries.totalRatings,
    discountPercentage: testSeries.discountPercentage,
    isFeatured: testSeries.isFeatured,
    validityPeriod: testSeries.validityPeriod,
    hasPurchased: userHasPurchased,
    createdAt: testSeries.createdAt,
    updatedAt: testSeries.updatedAt,
  };

  // Handle test access based on purchase status
  if (userHasPurchased) {
    // Full access - include all tests
    responseData.tests = testSeries.tests;
    responseData.accessType = 'full';
  } else {
    // Limited access - only show free tests or first test as preview
    const freeTests = testSeries.tests.filter(test => test.isFree);
    if (freeTests.length > 0) {
      responseData.tests = freeTests;
      responseData.accessType = 'limited';
      responseData.totalLockedTests = testSeries.tests.length - freeTests.length;
    } else {
      // Show first test as preview but mark questions as locked
      const previewTest = testSeries.tests[0];
      if (previewTest) {
        responseData.tests = [{
          ...previewTest.toObject(),
          questions: [], // Hide questions for preview
          isPreview: true
        }];
      } else {
        responseData.tests = [];
      }
      responseData.accessType = 'locked';
      responseData.totalLockedTests = testSeries.tests.length;
    }
  }

  res.json(responseData);
});

module.exports = {
  createTestSeries,
  getAllTestSeries,
  getTestSeriesById,
  updateTestSeries,
  deleteTestSeries,
  createTest,
  updateTest,
  deleteTest,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllTestSeriesPublic,
  getTestSeriesByIdPublic,
};

