import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    group: {
      type: String,
      enum: ['equipment', 'supplement', 'supplements', 'accessories'],
      default: 'equipment'
    },
    slug: String,
    description: String,
    art: String,
    itemCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Category = mongoose.model('Category', categorySchema);
export default Category;
