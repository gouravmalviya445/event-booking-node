import mongoose from "mongoose";
import { ENV } from "../env";

export async function connectDB() {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB host:", mongoose.connection.host);
    })
    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected to MongoDB");
    })
    
    await mongoose.connect(`${ENV.mongodbUrl}/${ENV.dbName}`);
  } catch (error) {
    console.log("Database Connection Failed", error);
    process.exit(1);
  }
}