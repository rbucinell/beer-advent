import mongoose, { Date as MongooseDate, Schema, Types } from "mongoose";

export interface IAuthUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: MongooseDate;
  updatedAt: MongooseDate;
  username: string;
  displayUsername: string;
  preferredDays: (number | null)[];
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
  updatedAt: {
    type: Date,
    required: [true, "updatedAt is required"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
  },
  displayUsername: {
    type: String,
    required: false
  },
  preferredDays: {
    type: [Schema.Types.Mixed],
    required: false
  }
},
  {
    collection: 'user',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const AuthUser = mongoose.models.AuthUser || mongoose.model<IAuthUser>('AuthUser', authUserSchema);
export default AuthUser;
