import mongoose, { Schema } from "mongoose";

const beerSchema = new Schema(
    {
        brewer: {
            type: String,
        },

        name: {
            type: String,
            required: [true, "Name is required"],
        },

        type: {
            type: String,
            required: [true, "Message is requried"]
        },

        img: {
            type: String,
        }
    },
    {
        collection: 'beers'
    });

const Beer = mongoose.models.Beer || mongoose.model('Beer', beerSchema);
export default Beer;