const mongoose = require('mongoose');

const currentAffairSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  detailedContent: {
    type: String,
    required: [true, 'Detailed content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Polity',
      'Economy',
      'Environment',
      'Science & Technology',
      'International',
      'National',
      'State Affairs',
      'Sports',
      'Awards & Honors',
      'Miscellaneous'
    ],
    default: 'Miscellaneous'
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  relatedExams: [{
    type: String,
    enum: ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Defense', 'Teaching', 'Others']
  }],
  source: {
    type: String,
    trim: true
  },
  importanceLevel: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-set month and year before saving
currentAffairSchema.pre('save', function(next) {
  const date = new Date(this.date);
  this.month = date.toLocaleString('default', { month: 'long' });
  this.year = date.getFullYear();
  next();
});

// Index for efficient queries
currentAffairSchema.index({ date: -1, category: 1 });
currentAffairSchema.index({ isPublished: 1, date: -1 });
currentAffairSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('CurrentAffair', currentAffairSchema);