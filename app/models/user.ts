import mongoose, { Schema, Types } from "mongoose";

export interface IUsers extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}

export const userSchema = new Schema<IUsers>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },
    imageUrl: String
  },
  {
    collection: 'users',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Users = mongoose.models.User || mongoose.model<IUsers>('User', userSchema);
export default Users;
