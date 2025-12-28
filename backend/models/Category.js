const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        order: {
            type: Number,
            required: true,
            default: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual to get subcategories
CategorySchema.virtual('subcategories', {
    ref: 'Subcategory',
    localField: '_id',
    foreignField: 'category',
    options: { sort: { order: 1 } }
});

// Virtual to get videos directly under this category (when no subcategories)
CategorySchema.virtual('videos', {
    ref: 'Video',
    localField: '_id',
    foreignField: 'category',
    options: { sort: { order: 1 } }
});

// Index for efficient queries
CategorySchema.index({ course: 1, order: 1 });
CategorySchema.index({ course: 1, isActive: 1 });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;