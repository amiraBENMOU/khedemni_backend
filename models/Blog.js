import { Schema, model } from "mongoose";

const blogSchema = new Schema({
  topic: {
    type: String,
    required: [true, "Topic is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
  },
  userAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

export default model("Blog", blogSchema);
