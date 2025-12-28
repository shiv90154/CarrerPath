const asyncHandler = require('express-async-handler');
const TestSeries = require('../models/TestSeries');
const Test = require('../models/Test');
const Question = require('../models/Question');
const Order = require('../models/Order');

// @desc    Create a new test series
// @route   POST /api/testseries/admin
// @access  Private/Admin
const createTestSeries = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const {
    title,
    description,
    fullDescription,
    price,
    originalPrice,
    image,
    category,
    level,
    duration,
    language,
    tags,
    requirements,
    whatYouWillLearn,
    content, // New hierarchical content structure
    validityPeriod,
    hasLiveTests,
    liveTestSchedule,
    resultAnalysis,
    rankingSystem,
    solutionAvailable
  } = req.body;

  if (!title || !price || !category || !fullDescription) {
    res.status(400);
    throw new Error("Title, price, category and full description are required");
  }

  const testSeries = new TestSeries({
    title,
    description,
    fullDescription,
    price,
    originalPrice: originalPrice || price,
    image: image || '/images/sample.jpg',
    category,
    level: level || 'Beginner',
    duration,
    language: language || 'English',
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    requirements: requirements ? requirements.split(',').map(req => req.trim()) : [],
    whatYouWillLearn: whatYouWillLearn ? whatYouWillLearn.split(',').map(item => item.trim()) : [],
    content: content || [], // Initialize with hierarchical content structure
    validityPeriod: validityPeriod || 365,
    hasLiveTests: hasLiveTests || false,
    liveTestSchedule: liveTestSchedule || '',
    resultAnalysis: resultAnalysis !== undefined ? resultAnalysis : true,
    rankingSystem: rankingSystem !== undefined ? rankingSystem : true,
    solutionAvailable: solutionAvailable !== undefined ? solutionAvailable : true,
    instructor: req.user._id,
  });

  const createdTestSeries = await testSeries.save();
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
  const {
    title,
    description,
    fullDescription,
    price,
    originalPrice,
    image,
    category,
    level,
    duration,
    language,
    tags,
    requirements,
    whatYouWillLearn,
    content, // New hierarchical content structure
    validityPeriod,
    hasLiveTests,
    liveTestSchedule,
    resultAnalysis,
    rankingSystem,
    solutionAvailable,
    isActive,
    isFeatured
  } = req.body;

  const testSeries = await TestSeries.findById(req.params.id);

  if (!testSeries) {
    res.status(404);
    throw new Error('Test Series not found');
  }

  testSeries.title = title || testSeries.title;
  testSeries.description = description || testSeries.description;
  testSeries.fullDescription = fullDescription || testSeries.fullDescription;
  testSeries.price = price !== undefined ? price : testSeries.price;
  testSeries.originalPrice = originalPrice !== undefined ? originalPrice : testSeries.originalPrice;
  testSeries.image = image || testSeries.image;
  testSeries.category = category || testSeries.category;
  testSeries.level = level || testSeries.level;
  testSeries.duration = duration || testSeries.duration;
  testSeries.language = language || testSeries.language;
  testSeries.tags = tags ? tags.split(',').map(tag => tag.trim()) : testSeries.tags;
  testSeries.requirements = requirements ? requirements.split(',').map(req => req.trim()) : testSeries.requirements;
  testSeries.whatYouWillLearn = whatYouWillLearn ? whatYouWillLearn.split(',').map(item => item.trim()) : testSeries.whatYouWillLearn;
  testSeries.validityPeriod = validityPeriod !== undefined ? validityPeriod : testSeries.validityPeriod;
  testSeries.hasLiveTests = hasLiveTests !== undefined ? hasLiveTests : testSeries.hasLiveTests;
  testSeries.liveTestSchedule = liveTestSchedule !== undefined ? liveTestSchedule : testSeries.liveTestSchedule;
  testSeries.resultAnalysis = resultAnalysis !== undefined ? resultAnalysis : testSeries.resultAnalysis;
  testSeries.rankingSystem = rankingSystem !== undefined ? rankingSystem : testSeries.rankingSystem;
  testSeries.solutionAvailable = solutionAvailable !== undefined ? solutionAvailable : testSeries.solutionAvailable;
  testSeries.isActive = isActive !== undefined ? isActive : testSeries.isActive;
  testSeries.isFeatured = isFeatured !== undefined ? isFeatured : testSeries.isFeatured;

  // Update hierarchical content structure if provided
  if (content) {
    testSeries.content = content;
  }

  const updatedTestSeries = await testSeries.save();
  res.json(updatedTestSeries);
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
    })
    .populate({
      path: 'liveTests',
      populate: {
        path: 'questions',
      },
    })
    .populate({
      path: 'content.subcategories.tests',
      model: 'Test',
      populate: {
        path: 'questions',
        model: 'Question'
      }
    })
    .populate({
      path: 'content.subcategories.liveTests',
      model: 'LiveTest',
      populate: {
        path: 'questions',
        model: 'Question'
      }
    })
    .populate({
      path: 'content.tests',
      model: 'Test',
      populate: {
        path: 'questions',
        model: 'Question'
      }
    })
    .populate({
      path: 'content.liveTests',
      model: 'LiveTest',
      populate: {
        path: 'questions',
        model: 'Question'
      }
    });

  if (!testSeries || !testSeries.isActive) {
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
    totalLiveTests: testSeries.totalLiveTests,
    totalQuestions: testSeries.totalQuestions,
    enrolledStudents: testSeries.enrolledStudents,
    rating: testSeries.rating,
    totalRatings: testSeries.totalRatings,
    discountPercentage: testSeries.discountPercentage,
    isFeatured: testSeries.isFeatured,
    validityPeriod: testSeries.validityPeriod,
    hasLiveTests: testSeries.hasLiveTests,
    liveTestSchedule: testSeries.liveTestSchedule,
    resultAnalysis: testSeries.resultAnalysis,
    rankingSystem: testSeries.rankingSystem,
    solutionAvailable: testSeries.solutionAvailable,
    hasPurchased: userHasPurchased,
    createdAt: testSeries.createdAt,
    updatedAt: testSeries.updatedAt,
  };

  // Handle hierarchical content structure
  if (testSeries.content && testSeries.content.length > 0) {
    if (userHasPurchased) {
      // Full access - include all tests and live tests
      responseData.content = testSeries.content;
      responseData.accessType = 'full';
    } else {
      // Limited access - filter content based on free tests
      const filteredContent = testSeries.content.map(category => ({
        ...category.toObject(),
        subcategories: category.subcategories.map(subcategory => ({
          ...subcategory.toObject(),
          tests: subcategory.tests.filter(test => test.isFree || test.isPreview),
          liveTests: subcategory.liveTests.filter(liveTest => liveTest.isFree || liveTest.isPreview)
        })),
        tests: category.tests.filter(test => test.isFree || test.isPreview),
        liveTests: category.liveTests.filter(liveTest => liveTest.isFree || liveTest.isPreview)
      }));

      responseData.content = filteredContent;
      responseData.accessType = 'limited';

      // Calculate total locked tests
      let totalLockedTests = 0;
      testSeries.content.forEach(category => {
        totalLockedTests += category.tests.filter(test => !test.isFree && !test.isPreview).length;
        totalLockedTests += category.liveTests.filter(liveTest => !liveTest.isFree && !liveTest.isPreview).length;
        category.subcategories.forEach(subcategory => {
          totalLockedTests += subcategory.tests.filter(test => !test.isFree && !test.isPreview).length;
          totalLockedTests += subcategory.liveTests.filter(liveTest => !liveTest.isFree && !liveTest.isPreview).length;
        });
      });
      responseData.totalLockedTests = totalLockedTests;
    }
  } else {
    // Fallback to legacy structure
    if (userHasPurchased) {
      // Full access - include all tests
      responseData.tests = testSeries.tests;
      responseData.liveTests = testSeries.liveTests;
      responseData.accessType = 'full';
    } else {
      // Limited access - only show free tests or first test as preview
      const freeTests = testSeries.tests.filter(test => test.isFree);
      const freeLiveTests = testSeries.liveTests.filter(liveTest => liveTest.isFree);

      if (freeTests.length > 0 || freeLiveTests.length > 0) {
        responseData.tests = freeTests;
        responseData.liveTests = freeLiveTests;
        responseData.accessType = 'limited';
        responseData.totalLockedTests = (testSeries.tests.length - freeTests.length) + (testSeries.liveTests.length - freeLiveTests.length);
      } else {
        // Show first test as preview but mark questions as locked
        const previewTest = testSeries.tests[0];
        const previewLiveTest = testSeries.liveTests[0];

        responseData.tests = previewTest ? [{
          ...previewTest.toObject(),
          questions: [], // Hide questions for preview
          isPreview: true
        }] : [];

        responseData.liveTests = previewLiveTest ? [{
          ...previewLiveTest.toObject(),
          questions: [], // Hide questions for preview
          isPreview: true
        }] : [];

        responseData.accessType = 'locked';
        responseData.totalLockedTests = testSeries.tests.length + testSeries.liveTests.length;
      }
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

