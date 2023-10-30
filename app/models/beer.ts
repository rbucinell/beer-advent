import mongoose, { Schema } from "mongoose";

export interface IBeer extends Document {
    _id: mongoose.Types.ObjectId;
    brewer: string;
    beer: string;
    type: string;
    img: string;
    year: number;
    day: number;
    person: string;
    beeradvocate: string;
    untappd: string;
    state: string;
}

const beerSchema = new Schema<IBeer>(
    {
        brewer: {
            type: String,
        },
        beer: {
            type: String,
            required: [true, "Name is required"],
        },
        type: {
            type: String,
        },
        img: {
            type: String,
        },
        year:{
            type: Number,
        },
        day: {
            type: Number,
        },
        person: {
            type: String
        },
        beeradvocate: {
            type: String
        },
        untappd: {
            type: String
        },
        state: {
            type: String
        }
    },
    {
        collection: 'beers'
    });

const Beer = mongoose.models.Beer || mongoose.model<IBeer>('Beer', beerSchema);
export default Beer;