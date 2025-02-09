import { Schema, model } from "mongoose";

const contactSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "full name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },

});

export default model("Contact", contactSchema);
