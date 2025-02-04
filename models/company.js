import { Schema, model } from "mongoose";


const companySchema = new Schema({
  companyName: {
    type: String,
    required: [true, "  Company name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
  },
  adresse: {
    type: String,
    required: [true, "Adresse is required"],
  },
  webPage: {
    type: String,
    required: [true, "Web page is required"],
  },

  logo: {
    type: String,
    required: [true, "Logo is required"],
  },
  
});

export default model("Company", companySchema);
