import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/************************** User MANAGEMENT  ********************************/
export const signUp = async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;

  console.log("Request Body:", req.body);

  const validateUser = (fullName, phoneNumber, email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ["hotmail.fr", "gmail.com"];
    const emailDomain = email.split("@")[1];
    const phoneRegex = /^\+?[0-9]+$/; // Updated regex to allow optional '+' at the beginning
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Regex for password validation

    if (!fullName || fullName.length <= 4) {
      return "INVALID_FULLNAME";
    }

    if (!email || !email.includes("@") || !emailRegex.test(email) || !validDomains.includes(emailDomain)) {
      return "INVALID_EMAIL";
    }

    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return "INVALID_PHONE";
    }

    if (!password || !passwordRegex.test(password)) {
      return "INVALID_PASSWORD";
    }

    return "VALID";
  };

  const validationResult = validateUser(fullName, phoneNumber, email, password);

  switch (validationResult) {
    case "INVALID_FULLNAME":
      return res.status(400).json({ message: "Full name is required and must be greater than 4 characters." });
    case "INVALID_EMAIL":
      return res.status(400).json({ message: "Email is required and must be a valid email address including @ and ending with 'hotmail.fr' or 'gmail.com'." });
    case "INVALID_PHONE":
      return res.status(400).json({ message: "Phone number is required and must contain only numbers and/or a '+' sign at the beginning." });
    case "INVALID_PASSWORD":
      return res.status(400).json({ message: "Password is required and must be at least 8 characters long and contain a mix of letters, signs, and numbers." });
    case "VALID":
      console.log("All validations passed");
      break;
    default:
      return res.status(400).json({ message: "Invalid data" });
  }

  // Check for duplicate user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "A user with the same email already exists." });
  }

  const user = await User.create({
    fullName,
    phoneNumber,
    email,
    password,
  });

  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    token: generateToken(user._id),
  });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && password === user.password) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};  
export const getUsers = async (req, res) => {
  const { fullName, email,id } = req.query;

  // Build a filter object dynamically
  const filter = {};
  if (fullName) filter.fullName = { $regex: fullName, $options: "i" }; // Case-insensitive regex search
  if (email) filter.email = { $regex: email, $options: "i" };
  if (id) filter._id = id; // Exact match for ID

  try {
    const users = await User.find(filter);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching users", error });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
    // Validate `id` to ensure it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }
  
   const user = await User.findById(id);
  res.status(StatusCodes.OK).json(user);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, phoneNumber,email,password } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      fullName,
      phoneNumber,
      email,
      password,
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid User ID.' });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User deleted successfully" });
};



