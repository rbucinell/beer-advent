import mongoose, {Schema, Types } from "mongoose";

export interface IParticipant extends Document{
    _id: mongoose.Types.ObjectId;
    name: string;
    user: Types.ObjectId;
    xmas: Types.ObjectId | null;
    days: number[];
    beers: Types.ObjectId[];
    event: Types.ObjectId;
}

export const participantSchema = new Schema<IParticipant>(
    {
        name:  String,
        xmas: {
            type: Schema.Types.ObjectId,
            ref: 'Participant'
        },
        days:  [Number],
        beers: [{
            type: Schema.Types.ObjectId,
            ref: 'Beer',
            default: []
        }],
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    }, {
        collection: 'participants',
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
});

const Participant = mongoose.models.Participant || mongoose.model<IParticipant>('Participant', participantSchema);
export default Participant;