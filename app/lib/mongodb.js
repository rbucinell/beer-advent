import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        if( mongoose.connection.readyState === 0 ){
            console.log( process.env.MONGODB_URI);
            await mongoose.connect(`mongodb+srv://user_ro:beer_ro@cluster0.a3kye.mongodb.net/beer-advent` );
            console.log( 'db connected');
        }
    } catch( err ){
        console.log( err );
    }
}

export default connectDB;