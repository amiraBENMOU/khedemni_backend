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
  },

 image: {
    type: String,
    required: [true, "Logo is required"],
      default:
        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
  },
  
});

export default model("Company", companySchema);
