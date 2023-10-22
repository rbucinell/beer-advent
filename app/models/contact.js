import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [2, "Name must be larger than 2 chars"],
        maxLength: [50, "Name must be less than 50 chars"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
    },

    message: {
        type: String,
        required: [true, "Message is requried"]
    },

    date: {
        type: Date,
        default: Date.now
    }
    },
    {
        collection: 'beers'
    });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export default Contact;