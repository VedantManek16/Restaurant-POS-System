import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.databaseURI);
        // console.log(`MongoDB connected: ${conn.connection.host}`);
        console.log("MongoDB Connected Successfully!!")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;