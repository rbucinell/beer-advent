import mongoose, {Schema} from "mongoose";

export interface IEvent extends Document {
    name: string;
    year: number;
}

const eventSchema = new Schema<IEvent>(
    {
        name: String,
        year: Number
    },
    {
        collection: 'events'
    }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
export default Event;