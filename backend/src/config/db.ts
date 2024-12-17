import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbUrl = process.env.MONGODB_URL;

console.log("dbURL",dbUrl);

export const connectDb = async () : Promise<void> => {
    try{
       await mongoose.connect(dbUrl as string);
       console.log("Connected to MongoDB...");
    }catch (error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
