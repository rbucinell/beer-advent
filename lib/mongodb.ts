import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log(process.env.MONGODB_URI)
      await mongoose.connect(process.env.MONGODB_URI as string);
    }
  } catch (err) {
    console.log(err);
  }
}
export default connectDB;
