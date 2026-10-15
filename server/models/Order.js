import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  art: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: true
    },
    customer: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    coupon: String,
    delivery: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    points: {
      type: Number,
      default: 0
    },
    address: {
      line1: String,
      city: String,
      zip: String
    },
    notes: String,
    payment: {
      type: String,
      default: 'Card'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    stripePaymentIntentId: String,
    stage: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    status: {
      type: String,
      default: 'Order Placed'
    },
    placedAt: {
      type: Date,
      default: Date.now
    },
    eta: String
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;
