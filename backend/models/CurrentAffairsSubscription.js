const mongoose = require('mongoose');

const CurrentAffairsSubscriptionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        package: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'CurrentAffairsPackage',
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Order',
        },

        // Subscription details
        subscriptionType: {
            type: String,
            enum: ['trial', 'paid', 'complimentary'],
            default: 'paid'
        },

        // Dates
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },

        // Status
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled', 'suspended'],
            default: 'active',
        },

        // Payment details
        amountPaid: {
            type: Number,
            required: true,
            default: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },

        // Auto-renewal settings
        autoRenewal: {
            type: Boolean,
            default: false,
        },
        nextBillingDate: {
            type: Date,
        },

        // Usage tracking
        lastAccessDate: {
            type: Date,
            default: Date.now,
        },
        totalArticlesRead: {
            type: Number,
            default: 0,
        },
        dailyReadCount: [{
            date: {
                type: Date,
                default: Date.now,
            },
            count: {
                type: Number,
                default: 0,
            }
        }],

        // Cancellation details
        cancelledAt: {
            type: Date,
        },
        cancellationReason: {
            type: String,
        },
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        // Renewal history
        renewalHistory: [{
            renewedAt: {
                type: Date,
                default: Date.now,
            },
            previousEndDate: Date,
            newEndDate: Date,
            amountPaid: Number,
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
            }
        }],

        // Notifications settings
        emailNotifications: {
            type: Boolean,
            default: true,
        },
        smsNotifications: {
            type: Boolean,
            default: false,
        },
        pushNotifications: {
            type: Boolean,
            default: true,
        },

        // Access preferences
        preferredDeliveryTime: {
            type: String,
            default: '06:00', // 6 AM
        },
        preferredLanguage: {
            type: String,
            enum: ['English', 'Hindi', 'Both'],
            default: 'English',
        },

        // Admin notes
        adminNotes: {
            type: String,
        },

        // Metadata
        deviceInfo: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual to check if subscription is currently active
CurrentAffairsSubscriptionSchema.virtual('isActive').get(function () {
    return this.status === 'active' && this.endDate > new Date();
});

// Virtual to get days remaining
CurrentAffairsSubscriptionSchema.virtual('daysRemaining').get(function () {
    if (this.endDate > new Date()) {
        return Math.ceil((this.endDate - new Date()) / (1000 * 60 * 60 * 24));
    }
    return 0;
});

// Virtual to check if subscription is expiring soon (within 7 days)
CurrentAffairsSubscriptionSchema.virtual('isExpiringSoon').get(function () {
    const daysRemaining = this.daysRemaining;
    return daysRemaining > 0 && daysRemaining <= 7;
});

// Pre-save middleware to set end date based on package duration
CurrentAffairsSubscriptionSchema.pre('save', async function (next) {
    if (this.isNew && !this.endDate) {
        try {
            const packageDoc = await mongoose.model('CurrentAffairsPackage').findById(this.package);
            if (packageDoc) {
                const startDate = this.startDate || new Date();
                this.endDate = new Date(startDate.getTime() + (packageDoc.validityPeriod * 24 * 60 * 60 * 1000));

                // Set next billing date for auto-renewal
                if (this.autoRenewal) {
                    this.nextBillingDate = new Date(this.endDate.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days before expiry
                }
            }
        } catch (error) {
            console.error('Error setting subscription end date:', error);
        }
    }
    next();
});

// Index for efficient queries
CurrentAffairsSubscriptionSchema.index({ user: 1, status: 1 });
CurrentAffairsSubscriptionSchema.index({ package: 1, status: 1 });
CurrentAffairsSubscriptionSchema.index({ endDate: 1, status: 1 });
CurrentAffairsSubscriptionSchema.index({ nextBillingDate: 1, autoRenewal: 1 });
CurrentAffairsSubscriptionSchema.index({ status: 1, endDate: 1 });

const CurrentAffairsSubscription = mongoose.model('CurrentAffairsSubscription', CurrentAffairsSubscriptionSchema);

module.exports = CurrentAffairsSubscription;