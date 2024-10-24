import mongoose, { Schema, Types } from "mongoose";

export interface IUser extends mongoose.Document {
    _id: Types.ObjectId;
    clerkId: string;
    role: string;
    fullName: string;
    imageUrl: string;
}

export const userSchema = new Schema<IUser>(
    {
        clerkId: String,
        role: String,
        fullName: String,
        imageUrl: String
    },
    {
        collection: 'users',
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;