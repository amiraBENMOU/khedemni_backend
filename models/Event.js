import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  userAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

export default model("Event", eventSchema);
