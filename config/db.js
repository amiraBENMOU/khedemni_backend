import mongoose from "mongoose";
import "dotenv/config";

mongoose.set("strictQuery", true);
// Connect MongoDB at mongoURL or default port 27017.
const connectDB = () => {
  const mongodb_url = process.env.mongodb_url || "mongodb://localhost:27017";
  mongoose.connect(mongodb_url, { useNewUrlParser: true }, (error) => {
    if (!error) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      throw new Error("Error in DB connection: " + error);
    }
  });
};

export default connectDB;
