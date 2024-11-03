import mongoose, { Schema, Types } from "mongoose";

export interface IBeer extends Document {
    _id: mongoose.Types.ObjectId;
    brewer: string;
    beer: string;
    type: string;
    img: string;
    year: number;
    day: number;
    abv: number;
    person: string;
    user: Types.ObjectId;
    beeradvocate: string;
    untappd: string;
    state: string;
}

const beerSchema = new Schema<IBeer>(
    {
        brewer: {
            type: String,
            required: [true, "Brewery is required"],
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
        abv: {
            type: Number,
        },
        person: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
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