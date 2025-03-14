import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Position from "../models/ourRecrutment.js";
import fs from 'fs';
import path from 'path';


/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 */
export const createPosition = async (req, res) => {
  try {
    const { positionTitle, positionType, Domain, DescriptionOfThePosition, typeOfContract, numberOfPepeol } = req.body;

    // Check if all required fields are provided
    if (!positionTitle || !positionType || !Domain || !DescriptionOfThePosition || !typeOfContract) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const position = await Position.create({
      positionTitle,
      positionType,
      Domain,
      DescriptionOfThePosition,
      typeOfContract,
      numberOfPepeol,
    });

    //await position.save();
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all jobs
 * @route   GET /api/jobs
 */
export const getPositions = async (req, res) => {
  const {positionTitle, positionType,Domain,DescriptionOfThePosition,typeOfContract,numberOfPepeol, id } = req.query;
  try {
    const positions = await Position.find(); // Populate company details
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get a single job by ID
 * @route   GET /api/jobs/:id
 */
export const getPositionById = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id).populate("position");
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    res.status(200).json(position);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update a job
 * @route   PUT /api/jobs/:id
 */
export const updatePosition = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    const { positionTitle,positionType,Domain,DescriptionOfThePosition,typeOfContract,numberOfPepeol } = req.body;
    position.positionTitle = positionTitle || position.positionTitle;
    position.positionType = positionType || position.positionType;
    position.Domain = Domain || position.Domain;
    position.DescriptionOfThePosition = DescriptionOfThePosition || position.DescriptionOfThePosition;
    position.typeOfContract = typeOfContract || position.typeOfContract;
    position.numberOfPepeol = numberOfPepeol || position.numberOfPepeol;
    

    await position.save();
    res.status(200).json(position);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a job
 * @route   DELETE /api/jobs/:id
 */
export const deletePosition= async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    await position.deleteOne();
    res.status(200).json({ message: "Position deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload endpoint
export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ filePath: `./uploads/${req.file.filename}`, message: 'File uploaded successfully' });
};
//get the uploaded files 
export const getUploadFiles = (req, res) => {
  const uploadDir = './uploads/';
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Unable to scan files", error: err.message });
    }

    const fileList = files
      .filter(file => fs.lstatSync(path.join(uploadDir, file)).isFile())
      .map(file => ({
        fileName: file,
        url: `http://localhost:50000/uploads/${file}` // Adjust the server URL
      }));

    res.status(200).json(fileList);
  });
};
