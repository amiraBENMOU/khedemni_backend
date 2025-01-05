import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
// { BadRequestErrorAPI } from "../utils/errorAPI";
import Contact from "../models/Contact.js";
import  buildReport from "../utils/pdf.js";
import { Readable } from "stream"; // Import Readable

/************************** Contact MANAGMENT  ********************************/
export const createContact = async (req, res) => {
  const { fullName, email, content } = req.body;

  console.log("Request Body:", req.body);

  if (!fullName || !email || !content) {
    throw console.log("Please provide all values");
  }

  const contact = await Contact.create({
    fullName,
    email,
    content,
  });

  res.status(StatusCodes.CREATED).json(contact);
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

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    throw new NotFoundErrorAPI("Contact not found");
  }

  res
    .status(StatusCodes.OK)
    .json({ message: `Contact created by  ${contact.fullName} deleted with success.` });
};


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