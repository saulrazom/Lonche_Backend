import mongoose, { Document, Schema } from 'mongoose';

export interface Comment extends Document {
  id_post: Schema.Types.ObjectId;
  id_user: Schema.Types.ObjectId;
  content: string;
  likes: number;
  dislikes: number;
  creationDate?: Date;
}

const CommentSchema = new Schema({
  id_post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post ID is required'],
  },
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [1, 'Content must be at least 1 characters long'],
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const commentModel = mongoose.model<Comment>('Comment', CommentSchema);
export default commentModel;
