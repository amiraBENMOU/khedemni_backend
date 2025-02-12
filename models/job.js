import { Schema, model } from "mongoose";
import Company from "./company";


const jobSchema = new Schema({
  jobTitle: {
    type: String,
    required: [true, "  Job Title is required"],
  },
  descrition: {
    type: String,
    required: [true, "description  is required"],
  },
  numberOfPeople: {
    type: String,
    required: [true, "number of pepeol needed  is required"],
  },
  offer_end_date: {
    type: Date,
    required: [true, "the end date of the offer is required "],
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  
  
}
});

export default model("Job", jobSchema);
