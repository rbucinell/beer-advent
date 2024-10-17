import mongoose, {Schema, Types } from "mongoose";

export interface IParticipant extends Document{
    _id: mongoose.Types.ObjectId;
    name: string;
    xmas: string;
    days: number[];
    beers: string[];
    event: Types.ObjectId;
    user: Types.ObjectId;
}

export const participantSchema = new Schema<IParticipant>(
    {
        name:  String,
        xmas:  String,
        days:  [Number],
        beers: [String],
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
        collection: 'participants',
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
});

const Participant = mongoose.models.Participant || mongoose.model<IParticipant>('Participant', participantSchema);
export default Participant;