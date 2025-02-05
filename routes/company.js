import { Router } from "express";
import {
  createCompany,
  deleteCompany,
  getCompaniesById,
  updateCompany,
  getCompanies ,
} from "../controllers/company.js";

const companyRouter = Router();

companyRouter.post("/createCompany", createCompany);

companyRouter.get("/getCompanies", getCompanies);

companyRouter.get("/:id/getCompany", getCompaniesById);

companyRouter.patch("/:id/updateCompany", updateCompany);

companyRouter.delete("/:id/deleteContact", deleteCompany);



export default companyRouter ;