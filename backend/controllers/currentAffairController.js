const CurrentAffair = require('../models/CurrentAffair');
const mongoose = require('mongoose');

// @desc    Create new current affair
// @route   POST /api/current-affairs
// @access  Private (Admin)
exports.createCurrentAffair = async (req, res) => {
  try {
    const {
      title,
      description,
      detailedContent,
      category,
      date,
      tags,
      relatedExams,
      source,
      importanceLevel
    } = req.body;

    // Validate required fields
    if (!title || !description || !detailedContent || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, detailed content, and category'
      });
    }

    const currentAffair = await CurrentAffair.create({
      title,
      description,
      detailedContent,
      category,
      date: date || Date.now(),
      tags: tags || [],
      relatedExams: relatedExams || [],
      source,
      importanceLevel: importanceLevel || 'Medium',
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Current affair created successfully',
      data: currentAffair
    });
  } catch (error) {
    console.error('Create current affair error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update current affair
// @route   PUT /api/current-affairs/:id
// @access  Private (Admin)
exports.updateCurrentAffair = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid current affair ID'
      });
    }

    // Add updatedBy user
    updates.updatedBy = req.user.id;

    const currentAffair = await CurrentAffair.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!currentAffair) {
      return res.status(404).json({
        success: false,
        message: 'Current affair not found'
      });
    }

    res.json({
      success: true,
      message: 'Current affair updated successfully',
      data: currentAffair
    });
  } catch (error) {
    console.error('Update current affair error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete current affair
// @route   DELETE /api/current-affairs/:id
// @access  Private (Admin)
exports.deleteCurrentAffair = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid current affair ID'
      });
    }

    const currentAffair = await CurrentAffair.findByIdAndDelete(id);

    if (!currentAffair) {
      return res.status(404).json({
        success: false,
        message: 'Current affair not found'
      });
    }

    res.json({
      success: true,
      message: 'Current affair deleted successfully'
    });
  } catch (error) {
    console.error('Delete current affair error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle publish status
// @route   PATCH /api/current-affairs/toggle-publish/:id
// @access  Private (Admin)
exports.togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid current affair ID'
      });
    }

    const currentAffair = await CurrentAffair.findById(id);

    if (!currentAffair) {
      return res.status(404).json({
        success: false,
        message: 'Current affair not found'
      });
    }

    currentAffair.isPublished = !currentAffair.isPublished;
    currentAffair.updatedBy = req.user.id;
    await currentAffair.save();

    res.json({
      success: true,
      message: `Current affair ${currentAffair.isPublished ? 'published' : 'unpublished'} successfully`,
      data: currentAffair
    });
  } catch (error) {
    console.error('Toggle publish status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all current affairs (Admin)
// @route   GET /api/current-affairs/admin/all
// @access  Private (Admin)
exports.getAllCurrentAffairsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      year,
      month,
      search,
      isPublished
    } = req.query;

    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (year) query.year = parseInt(year);
    if (month) query.month = month;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    // Search in title, description, and tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const currentAffairs = await CurrentAffair.find(query)
      .sort({ date: -1, createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await CurrentAffair.countDocuments(query);

    res.json({
      success: true,
      data: currentAffairs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all current affairs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get published current affairs (Student)
// @route   GET /api/current-affairs/published
// @access  Public
exports.getPublishedCurrentAffairs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      year,
      month,
      search,
      importanceLevel
    } = req.query;

    const query = { isPublished: true };

    // Apply filters
    if (category) query.category = category;
    if (year) query.year = parseInt(year);
    if (month) query.month = month;
    if (importanceLevel) query.importanceLevel = importanceLevel;

    // Search in title, description, and tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const currentAffairs = await CurrentAffair.find(query)
      .select('-__v -createdBy -updatedBy -updatedAt')
      .sort({ date: -1, importanceLevel: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await CurrentAffair.countDocuments(query);

    // Get available years and months for filtering
    const years = await CurrentAffair.distinct('year', { isPublished: true });
    const months = await CurrentAffair.distinct('month', { isPublished: true });
    const categories = await CurrentAffair.distinct('category', { isPublished: true });

    res.json({
      success: true,
      data: currentAffairs,
      filters: {
        years: years.sort((a, b) => b - a),
        months: months,
        categories: categories
      },
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get published current affairs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single current affair
// @route   GET /api/current-affairs/:id
// @access  Public
exports.getCurrentAffairById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid current affair ID'
      });
    }

    const currentAffair = await CurrentAffair.findOneAndUpdate(
      { _id: id, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).select('-__v -createdBy -updatedBy');

    if (!currentAffair) {
      return res.status(404).json({
        success: false,
        message: 'Current affair not found or not published'
      });
    }

    // Get related current affairs (same category)
    const related = await CurrentAffair.find({
      _id: { $ne: id },
      category: currentAffair.category,
      isPublished: true
    })
    .select('title date category')
    .sort({ date: -1 })
    .limit(4);

    res.json({
      success: true,
      data: {
        currentAffair,
        related
      }
    });
  } catch (error) {
    console.error('Get current affair by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get filter options
// @route   GET /api/current-affairs/filters/options
// @access  Public
exports.getFilterOptions = async (req, res) => {
  try {
    const years = await CurrentAffair.distinct('year', { isPublished: true });
    const months = await CurrentAffair.distinct('month', { isPublished: true });
    const categories = await CurrentAffair.distinct('category', { isPublished: true });

    res.json({
      success: true,
      data: {
        years: years.sort((a, b) => b - a),
        months: months,
        categories: categories
      }
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get statistics
// @route   GET /api/current-affairs/stats
// @access  Private (Admin)
exports.getStatistics = async (req, res) => {
  try {
    const total = await CurrentAffair.countDocuments();
    const published = await CurrentAffair.countDocuments({ isPublished: true });
    const unpublished = total - published;

    // Category-wise count
    const categoryStats = await CurrentAffair.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Month-wise count for current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await CurrentAffair.aggregate([
      {
        $match: {
          year: currentYear,
          isPublished: true
        }
      },
      {
        $group: {
          _id: '$month',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        published,
        unpublished,
        categoryStats,
        monthlyStats,
        currentYear
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};