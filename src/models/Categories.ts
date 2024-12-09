import mongoose, { Document, Schema } from 'mongoose';

export interface Category extends Document {
  name: string;
  color: string;
}

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category is required'],
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
  },
});

const categoryModel = mongoose.model<Category>('Category', CategorySchema);
export default categoryModel;
