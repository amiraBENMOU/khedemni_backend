import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
// { BadRequestErrorAPI } from "../utils/errorAPI";
import Job from "../models/Contact.js";
import { Readable } from "stream"; // Import Readable

/************************** Contact MANAGMENT  ********************************/
export const createContact = async (req, res) => {
  const { fullName, email, content } = req.body;

  console.log("Request Body:", req.body);

  const validateContact = (fullName, email, content) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ["hotmail.fr", "gmail.com"];
    const emailDomain = email.split("@")[1];

    if (!fullName || fullName.length <= 4) {
      return "INVALID_FULLNAME";
    }

    if (!email || !email.includes("@") || !emailRegex.test(email) || !validDomains.includes(emailDomain)) {
      return "INVALID_EMAIL";
    }

    if (!content || content.length <= 4) {
      return "INVALID_CONTENT";
    }

    return "VALID";
  };

  const validationResult = validateContact(fullName, email, content);

  switch (validationResult) {
    case "INVALID_FULLNAME":
      return res.status(400).json({ message: "Full name is required and must be greater than 4 characters." });
    case "INVALID_EMAIL":
      return res.status(400).json({ message: "Email is required and must be a valid email address including @ and ending with 'hotmail.fr' or 'gmail.com'." });
    case "INVALID_CONTENT":
      return res.status(400).json({ message: "Content is required and must be greater than 4 characters." });
    case "VALID":
      console.log("All validations passed");
      break;
    default:
      return res.status(400).json({ message: "Invalid contact" });
  }

// Check for duplicate contact
const existingContact = await Contact.findOne({ fullName, email, content });
if (existingContact) {
  return res.status(400).json({ message: "A contact with the same name, email, and content already exists." });
}

  const contact = await Contact.create({
    fullName,
    email,
    content,
  });

  res.status(201).json(contact);
};
export const getContacts = async (req, res) => {
  const { fullName, email, id } = req.query;

  // Build a filter object dynamically
  const filter = {};
  if (fullName) filter.fullName = { $regex: fullName, $options: "i" }; // Case-insensitive regex search
  if (email) filter.email = { $regex: email, $options: "i" };
  if (id) filter._id = id; // Exact match for ID

  try {
    const contacts = await Contact.find(filter);
    res.status(StatusCodes.OK).json(contacts);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching contacts", error });
  }
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
    // Validate `id` to ensure it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact ID.' });
    }
  
   const contact = await Contact.findById(id);
  res.status(StatusCodes.OK).json(contact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, content } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    id,
    {
      fullName,
      email,
      content,
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid contact ID.' });
  }

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.status(200).json({ message: "Contact deleted successfully" });
};
//the users that have written an contactUs email 
export const fetchUsersWithContacts = async () => {
  try {
    const result = await Contact.aggregate([
      {
        $lookup: {
          from: "Contact", // The name of the Contact collection
          foreignField: "_id", // Field in User model
          as: "userDetails", // Output field
        },
      },
      {
        $unwind: "$userDetails", // Deconstruct the array from $lookup
      },
      {
        $project: {
          "userDetails.fullName": 1,
          "userDetails.email": 1,
          "userDetails.phoneNumber": 1,
          fullName: 1,
          email: 1,
          content: 1,
        },
      },
    ]);

    console.log("Users with contacts:", result);
    return result;
  } catch (error) {
    console.error("Error fetching users with contacts:", error);
  }
};
// contact report 
export const getContactReport = async (req, res, next) => {
  const { id } = req.params;
  console.log("id", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid contact ID.' });
  }

  const contact = await Contact.findById(id);
  if (!contact) return next(new HttpError.NotFoundError("Contact not found"));

  const data = { contacts: [contact.toObject()] };
     console.log("data", data);
  const pdfBuffer = await buildReport("../view/contact.hbs", data, {
    format: "A4",
    landscape: true,
  });

  // Create a readable stream from the PDF buffer
  const stream = new Readable();
  stream.push(pdfBuffer);
  stream.push(null);

  res.setHeader('Content-Type', 'application/pdf');
  stream.pipe(res);
};