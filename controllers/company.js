import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Company from "../models/company.js";


/************************** Company MANAGEMENT  ********************************/
export const createCompany = async (req, res) => {
  const { companyName, email, phoneNumber, adresse, webPage, image: imageUrl } = req.body;

  console.log("Request Body:", req.body);

  /*const validateCompany = (companyName, email,phoneNumber, adresse) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ["hotmail.fr", "gmail.com"];
    const emailDomain = email.split("@")[1];
    const phoneRegex = /^(06|05|07)\d{8}$/; // Regex to validate phone number

    if (!companyName || companyName.length <= 4) {
      return "INVALID_COMPANYNAME";
    }

    if (!email || !email.includes("@") || !emailRegex.test(email) || !validDomains.includes(emailDomain)) {
      return "INVALID_EMAIL";
    }

    if (!adresse || adresse.length <= 4) {
      return "INVALID_ADRESSE";
    }

    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return "INVALID_PHONE";
    }

   /* if (webPage && !webPage.startsWith("http://")) {
         return "INVALID_WEBPAGE";
   }

    return "VALID";
  };
*/
  // const validationResult = validateCompany(companyName, email, phoneNumber, adresse);

  // switch (validationResult) {
  //   case "INVALID_COMPANYNAME":
  //     return res.status(400).json({ message: "Company name is required and must be greater than 4 characters." });
  //   case "INVALID_EMAIL":
  //     return res.status(400).json({ message: "Email is required and must be a valid email address including @ and ending with 'hotmail.fr' or 'gmail.com'." });
  //  case "INVALID_ADRESSE":
  //    return res.status(400).json({ message: "Adresse is required and must be greater than 4 characters." });
  //   case "INVALID_PHONE":
  //     return res.status(400).json({ message: "Phone number is required and must start with 06, 05, or 07 and be 10 digits long." });
  //   /*case "INVALID_WEBPAGE":
  //     return res.status(400).json({ message: "Web page must start with 'http://'." });*/
  //   case "VALID":
  //     console.log("All validations passed");
  //     break;
  //   default:
  //     return res.status(400).json({ message: "Invalid data" });
  // }


  try {
    const company = await Company.create({
      companyName,
      email,
      phoneNumber,
      adresse,
      webPage,
      image: req.body.image,
    });

    console.log("Company created:", company);
    res.status(201).json(company);
  } catch (error) {
    console.error("Error creating company :", error);
    res.status(400).json({ message: error.message });
  }
 };
export const getCompanies = async (req, res) => {
  const { id, companyName, email, phoneNumber, adresse, webPage,image } = req.query;

  // Build a filter object dynamically
  const filter = {};
  if (id) filter._id = id; // Exact match for ID
  if (companyName) filter.companyName = { $regex: companyName, $options: "i" }; // Case-insensitive regex search
  if (email) filter.email = { $regex: email, $options: "i" };
  if (phoneNumber) filter.phoneNumber = { $regex: phoneNumber, $options: "i" };
  if (adresse) filter.adresse = { $regex: adresse, $options: "i" };
  if (webPage) filter.webPage = { $regex: webPage, $options: "i" };

  try {
    const companies = await Company.find(filter);
    res.status(StatusCodes.OK).json(companies);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching companies", error });
  }
};

export const getCompaniesById = async (req, res) => {
  const { id } = req.params;
    // Validate `id` to ensure it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid company ID.' });
    }
  
   const company= await Company.findById(id);
  res.status(StatusCodes.OK).json(company);
};

export const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { companyName,email,phoneNumber,adresse,webPage,image } = req.body;

  const company = await Company.findByIdAndUpdate(
    id,
    {
      companyName,
      email,
      phoneNumber,
      adresse,
      webPage,
      image,
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json(company);
};

export const deleteCompany = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid company ID.' });
  }

  const company = await Company.findByIdAndDelete(id);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  res.status(200).json({ message: "Company deleted successfully" });
}