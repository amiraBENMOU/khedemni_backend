import mongoose from "mongoose";
import "dotenv/config";

mongoose.set("strictQuery", true);
const mongodb_url = "mongodb+srv://IM:amira2001@atlascluster.pdut1ay.mongodb.net/contact?retryWrites=true&w=majority&appName=AtlasCluster"; // Connection string

const connectDB = async () => {
  try {
    await mongoose.connect(mongodb_url);
    console.log("MongoDB Connection Succeeded.");
  } catch (error) {
    console.error("Error in DB connection:", error.message);
    throw error; // Optional: Re-throw the error for higher-level handling
  }
};

export default connectDB;
