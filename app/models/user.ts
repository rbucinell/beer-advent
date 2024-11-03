import mongoose, { Schema, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
}

export const userSchema = new Schema<IUser>(
    {
        firstName:{
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

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;