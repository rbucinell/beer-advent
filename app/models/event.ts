import mongoose, { Schema, Types } from "mongoose";

export interface IEvent extends Document {
    _id: Types.ObjectId;
    name: string;
    year: number;

    exchange: {
        date: Date,
        location: {
            name: string;
            address: string;
        }
    } | null;

    rules: string[]|null;
    days: number;
}

const eventSchema = new Schema<IEvent>(
    {
        _id: mongoose.Types.ObjectId,
        name: String,
        year: Number,
        exchange: {
            date: mongoose.Schema.Types.Date,
            location: {
                name: String,
                address: String
            }
        },
        rules: [String],
        days: { type:Number, default: 24 }
    },
    {
        collection: 'events'
    }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
export default Event;