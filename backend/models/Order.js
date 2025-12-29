const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Item details
    itemType: {
      type: String,
      required: true,
      enum: ['course', 'testSeries', 'ebook', 'studyMaterial', 'currentAffairs'],
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',
    },
    amount: {
      type: Number,
      required: true,
    },
    // Manual Google Pay payment details
    paymentMethod: {
      type: String,
      required: true,
      default: 'google_pay_manual',
    },
    screenshotUrl: {
      type: String,
      required: false, // Will be set when user uploads screenshot
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // Admin approval details
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    approvedAt: {
      type: Date,
      required: false,
    },
    rejectionReason: {
      type: String,
      required: false,
    },
    // Legacy fields for backward compatibility (will be removed)
    isPaid: {
      type: Boolean,
      default: function () {
        return this.status === 'approved';
      }
    },
    paidAt: {
      type: Date,
      default: function () {
        return this.status === 'approved' ? this.approvedAt : null;
      }
    },
  },
  {
    timestamps: true,
    // Virtual for dynamic refPath resolution
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual to populate item based on itemType
OrderSchema.virtual('item', {
  refPath: 'itemType',
  localField: 'itemId',
  foreignField: '_id',
  justOne: true
});

// Index for efficient queries
OrderSchema.index({ user: 1, status: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ itemType: 1, itemId: 1 });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;

