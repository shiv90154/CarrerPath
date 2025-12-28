const mongoose = require('mongoose');

const LiveTestSchema = mongoose.Schema(
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
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['registered', 'joined', 'completed', 'missed'],
          default: 'registered',
        }
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    passMark: {
      type: Number,
      required: true,
      default: 40,
    },
    negativeMarking: {
      type: Number, // e.g., 0.25 for -0.25 per wrong answer
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxParticipants: {
      type: Number,
      default: 1000,
    },
    // Live test specific features
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String, // e.g., "weekly", "monthly"
      enum: ['daily', 'weekly', 'monthly', 'custom'],
    },
    recurringDays: [String], // e.g., ["Monday", "Wednesday", "Friday"]
    // Test features
    showResultImmediately: {
      type: Boolean,
      default: false, // Usually false for live tests
    },
    showCorrectAnswers: {
      type: Boolean,
      default: false, // Usually shown after test ends
    },
    allowLateJoin: {
      type: Boolean,
      default: false,
    },
    lateJoinBuffer: {
      type: Number, // minutes after start time
      default: 0,
    },
    shuffleQuestions: {
      type: Boolean,
      default: true,
    },
    shuffleOptions: {
      type: Boolean,
      default: true,
    },
    // Proctoring features
    enableProctoring: {
      type: Boolean,
      default: false,
    },
    allowTabSwitch: {
      type: Boolean,
      default: false,
    },
    screenshotInterval: {
      type: Number, // in seconds, 0 means disabled
      default: 0,
    },
    // Notifications
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderTime: {
      type: Number, // minutes before start
      default: 30,
    },
    // Analytics
    totalRegistrations: {
      type: Number,
      default: 0,
    },
    totalAttendees: {
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
    // Status tracking
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total questions count
LiveTestSchema.virtual('totalQuestions').get(function () {
  return this.questions.length;
});

// Virtual for current participant count
LiveTestSchema.virtual('currentParticipants').get(function () {
  return this.participants.length;
});

// Virtual for available slots
LiveTestSchema.virtual('availableSlots').get(function () {
  return this.maxParticipants - this.participants.length;
});

// Virtual for test status based on time
LiveTestSchema.virtual('currentStatus').get(function () {
  const now = new Date();
  if (now < this.startTime) return 'upcoming';
  if (now >= this.startTime && now <= this.endTime) return 'live';
  return 'completed';
});

// Update participant counts
LiveTestSchema.pre('save', function (next) {
  this.totalRegistrations = this.participants.length;
  this.totalAttendees = this.participants.filter(p => p.status === 'joined' || p.status === 'completed').length;
  next();
});

const LiveTest = mongoose.model('LiveTest', LiveTestSchema);

module.exports = LiveTest;

