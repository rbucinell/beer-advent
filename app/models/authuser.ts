import mongoose, { Date as MongooseDate, Schema, Types } from "mongoose";

export interface IAuthUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: MongooseDate;
  updateAt: MongooseDate;
  username: string;
  displayUsername: string;
}

export const authUserSchema = new Schema<IAuthUser>({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: [true, "email name is required"],
  },
  emailVerified: {
    type: Boolean,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: [true, "createdAt is required"],
  },
  updateAt: {
    type: Date,
    required: [true, "updateAt is required"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
  },
  displayUsername: {
    type: String,
    required: false
  },
});

const AuthUser = mongoose.models.AuthUser || mongoose.model<IAuthUser>('user', authUserSchema);
export default AuthUser;
