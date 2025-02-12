import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Job Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    numberOfPeople: {
      type: Number, // Changed from String to Number
      required: [true, "Number of people needed is required"],
    },
    offer_end_date: {
      type: Date,
      required: [true, "The end date of the offer is required"],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true, // Ensures a company is always linked
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default model("Job", jobSchema);
