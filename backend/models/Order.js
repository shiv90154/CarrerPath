const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Legacy fields for backward compatibility
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Course',
    },
    testSeries: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'TestSeries',
    },
    ebook: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Ebook',
    },
    // New flexible items array for multiple products
    items: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
      testSeries: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestSeries',
      },
      ebook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ebook',
      },
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyMaterial',
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      }
    }],
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;

