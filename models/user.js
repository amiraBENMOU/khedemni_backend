import { Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "full name is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "phone number  is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },

  password: {
    type: String,
    required: [true, "password is required"],
  },
  
});

export default model("User", userSchema);
