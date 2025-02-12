import Job from "../models/job.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 */
export const createJob = async (req, res) => {
  try {
    const { jobTitle, description, numberOfPeople, offer_end_date, company } = req.body;

    // Check if all required fields are provided
    if (!jobTitle || !description || !numberOfPeople || !offer_end_date || !company) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = new Job({
      jobTitle,
      description,
      numberOfPeople,
      offer_end_date,
      company,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all jobs
 * @route   GET /api/jobs
 */
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company"); // Populate company details
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get a single job by ID
 * @route   GET /api/jobs/:id
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update a job
 * @route   PUT /api/jobs/:id
 */
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { jobTitle, description, numberOfPeople, offer_end_date, company } = req.body;
    job.jobTitle = jobTitle || job.jobTitle;
    job.description = description || job.description;
    job.numberOfPeople = numberOfPeople || job.numberOfPeople;
    job.offer_end_date = offer_end_date || job.offer_end_date;
    job.company = company || job.company;

    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a job
 * @route   DELETE /api/jobs/:id
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
