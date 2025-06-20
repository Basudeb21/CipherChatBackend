import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}${DB_NAME}`);

        console.log(`\n MongoDB Connected successfully!! ${connectionInstance.connection.host}: ${connectionInstance.connection.port}/${DB_NAME}`);

    } catch (error) {
        console.log("MongoDB Connection Error : ", error);
        process.exit(1)
    }
}

export default connectDB;