const mongoose = require('mongoose');

const CurrentAffairsPackageSchema = mongoose.Schema(
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
        fullDescription: {
            type: String,
            required: true,
        },
        packageType: {
            type: String,
            required: true,
            enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
            default: 'monthly'
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        originalPrice: {
            type: Number,
            default: 0,
        },
        coverImage: {
            type: String,
            required: true,
            default: '/images/current-affairs-default.jpg',
        },

        // Package duration and validity
        duration: {
            type: Number, // in days
            required: true,
            default: 30, // 30 days for monthly
        },
        validityPeriod: {
            type: Number, // in days from purchase
            required: true,
            default: 365, // 1 year access
        },

        // Content delivery schedule
        deliverySchedule: {
            type: String,
            enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
            default: 'daily'
        },
        deliveryTime: {
            type: String, // e.g., "06:00" for 6 AM
            default: '06:00'
        },

        // Categories included in this package
        includedCategories: [{
            type: String,
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
            ]
        }],

        // Target exams
        targetExams: [{
            type: String,
            enum: ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Defense', 'Teaching', 'Others']
        }],

        // Package features
        features: [{
            type: String,
            trim: true
        }],

        // Content statistics
        averageDailyArticles: {
            type: Number,
            default: 10
        },
        totalArticlesPerMonth: {
            type: Number,
            default: 300
        },

        // Package settings
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isFree: {
            type: Boolean,
            default: false,
        },

        // Trial settings
        hasFreeTrial: {
            type: Boolean,
            default: true,
        },
        freeTrialDays: {
            type: Number,
            default: 7,
        },

        // Analytics
        totalSubscribers: {
            type: Number,
            default: 0,
        },
        activeSubscribers: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalRatings: {
            type: Number,
            default: 0,
        },

        // Content access settings
        allowDownload: {
            type: Boolean,
            default: true,
        },
        allowPrint: {
            type: Boolean,
            default: true,
        },
        watermarkEnabled: {
            type: Boolean,
            default: false,
        },

        // Language support
        language: {
            type: String,
            default: 'English',
            enum: ['English', 'Hindi', 'Both']
        },

        // Tags for search
        tags: [String],

        // SEO fields
        metaTitle: String,
        metaDescription: String,

        // Admin fields
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for discount percentage
CurrentAffairsPackageSchema.virtual('discountPercentage').get(function () {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Virtual for monthly price (for yearly packages)
CurrentAffairsPackageSchema.virtual('monthlyEquivalentPrice').get(function () {
    if (this.packageType === 'yearly') {
        return Math.round(this.price / 12);
    }
    return this.price;
});

// Index for efficient queries
CurrentAffairsPackageSchema.index({ isActive: 1, packageType: 1 });
CurrentAffairsPackageSchema.index({ isFeatured: 1, isActive: 1 });
CurrentAffairsPackageSchema.index({ price: 1, packageType: 1 });
CurrentAffairsPackageSchema.index({ title: 'text', description: 'text', tags: 'text' });

const CurrentAffairsPackage = mongoose.model('CurrentAffairsPackage', CurrentAffairsPackageSchema);

module.exports = CurrentAffairsPackage;