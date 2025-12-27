const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            default: '',
        },
        badge: {
            type: String,
            enum: ['new', 'live', 'urgent', 'important', 'admission', 'exam', 'result'],
            default: 'new',
        },
        link: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        expiryDate: {
            type: Date,
            default: null,
        },
        priority: {
            type: Number,
            default: 1, // 1 = low, 2 = medium, 3 = high
        },
        targetAudience: {
            type: String,
            enum: ['all', 'students', 'instructors', 'admins'],
            default: 'all',
        },
        category: {
            type: String,
            enum: ['general', 'admission', 'exam', 'result', 'holiday', 'event', 'scholarship', 'course'],
            default: 'general',
        },
        attachments: [{
            name: String,
            url: String,
            type: String,
        }],
        views: {
            type: Number,
            default: 0,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Add indexes for better performance
NoticeSchema.index({ isPublished: 1, isActive: 1, publishDate: -1 });
NoticeSchema.index({ category: 1, priority: -1 });
NoticeSchema.index({ expiryDate: 1 });

// Virtual for checking if notice is expired
NoticeSchema.virtual('isExpired').get(function () {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
});

// Virtual for formatted publish date
NoticeSchema.virtual('formattedPublishDate').get(function () {
    return this.publishDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
});

// Method to increment views
NoticeSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;