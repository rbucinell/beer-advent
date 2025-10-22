import mongoose, { Schema, Types } from "mongoose";

export interface IOldUsers extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  claimedBy: Types.ObjectId;
}

export const oldUserSchema = new Schema<IOldUsers>(
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
    imageUrl: String,
    claimedBy:{
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    }
  },
  {
    collection: 'oldusers',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const OldUsers = mongoose.models.OldUsers || mongoose.model<IOldUsers>('OldUsers', oldUserSchema);
export default OldUsers;
