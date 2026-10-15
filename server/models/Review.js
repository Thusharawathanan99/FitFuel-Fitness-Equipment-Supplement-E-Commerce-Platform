import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    productId: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    userId: {
      type: String
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Review = mongoose.model('Review', reviewSchema);
export default Review;
