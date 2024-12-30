import { StatusCodes } from "http-status-codes";
// { BadRequestErrorAPI } from "../utils/errorAPI";
import Contact from "../models/Contact.js";

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

