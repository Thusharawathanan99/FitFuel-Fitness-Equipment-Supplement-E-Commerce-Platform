import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    group: {
      type: String,
      enum: ['equipment', 'supplement', 'supplements', 'accessories'],
      default: 'equipment'
    },
    price: {
      type: Number,
      required: true
    },
    discountPrice: {
      type: Number
    },
    rating: {
      type: Number,
      default: 4.5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0
    },
    sku: {
      type: String
    },
    art: {
      type: String,
      default: 'dumbbell'
    },
    imageUrl: {
      type: String
    },
    description: {
      type: String,
      required: true
    },
    specifications: {
      type: [[String]],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    },
    bestseller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model('Product', productSchema);
export default Product;
