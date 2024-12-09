import mongoose, { Document, Schema } from 'mongoose';
import IUser from '../types/User';
import ROLES from '../types/roles';
import USER_STATUS from '../types/userStatus';

export interface User extends IUser, Document {}

const UserSchema = new Schema({
  id_city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username must not exceed 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  name: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name must not exceed 50 characters'],
  },
  lastname: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name must not exceed 50 characters'],
  },
  birthdate: {
    type: Date,
    required: [true, 'Birthdate is required'],
    validate: {
      validator: function (value: Date) {
        return value <= new Date();
      },
      message: 'Birthdate must be in the past',
    },
  },
  role: {
    type: String,
    enum: {
      values: Object.values(ROLES),
      message: '{VALUE} is not a valid role',
    },
    default: ROLES.USER,
  },
  status: {
    type: String,
    enum: {
      values: Object.values(USER_STATUS),
      message: '{VALUE} is not a valid status',
    },
    default: USER_STATUS.ACTIVE,
  },
  profilePic: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio must not exceed 500 characters'],
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  numFollowers: {
    type: Number,
    default: 0,
    min: [0, 'Number of followers cannot be negative'],
  },
  numFollowing: {
    type: Number,
    default: 0,
    min: [0, 'Number of following cannot be negative'],
  },
});

const userModel = mongoose.model<User>('User', UserSchema);
export default userModel;
