import { Schema } from 'mongoose';
import ROLES from './roles';
import USER_STATUS from './userStatus';

export default interface User {
  _id: unknown;
  id_city?: Schema.Types.ObjectId;
  followers?: Schema.Types.ObjectId[];
  following?: Schema.Types.ObjectId[];
  username: string;
  email: string;
  password?: string;
  name: string;
  lastname: string;
  birthdate: Date;
  role?: ROLES;
  status?: USER_STATUS;
  profilePic?: string;
  bio?: string;
  joinDate?: Date;
  numFollowers: number;
  numFollowing: number;
}
