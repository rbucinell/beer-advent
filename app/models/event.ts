import mongoose, { Schema, Types } from "mongoose";

export interface IEvent extends Document {
    _id: Types.ObjectId;
    name: string;
    year: number;
}

const eventSchema = new Schema<IEvent>(
    {
        _id: mongoose.Types.ObjectId,
        name: String,
        year: Number
    },
    {
        collection: 'events'
    }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
export default Event;