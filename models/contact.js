import { Schema, model } from "mongoose";
import User from './user.js'

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
userId: {
    type: Schema.Types.ObjectId, // Reference to the User model
   ref: 'User',
    required: true,
  },
});

export default model("Contact", contactSchema);
