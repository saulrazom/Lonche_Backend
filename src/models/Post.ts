import mongoose, { Document, Schema } from 'mongoose';

export interface Post extends Document {
  id_city: Schema.Types.ObjectId;
  id_user: Schema.Types.ObjectId;
  username: string;
  title: string;
  content: string;
  categories: string[];
  creationDate?: Date;
  likes: number;
  likesIds?: Schema.Types.ObjectId[];
  numComments: number;
  mediaURL?: string;
}

const PostSchema = new Schema({
  id_city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: [true, 'City ID is required'],
  },
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title must not exceed 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters long'],
  },
  categories: {
    type: Array<String>,
    required: [true, 'Categories are required'],
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative'],
  },
  likesUsers: {
    type: Array<String>,
    default: [],
  },
  numComments: {
    type: Number,
    default: 0,
    min: [0, 'Number of comments cannot be negative'],
  },
  mediaURL: {
    type: String,
    match: [
      /^https?:\/\/.+\.(jpg|jpeg|png)$/,
      'Media URL must be a valid image or video URL',
    ],
  },
});

const postModel = mongoose.model<Post>('Post', PostSchema);
export default postModel;
