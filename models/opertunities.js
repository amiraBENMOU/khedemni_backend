import { Schema, model } from "mongoose";


const opertunitySchema = new Schema({
  companyName: {
    type: String,
    required: [true, "full name is required"],
  },
  j: {
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
