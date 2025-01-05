import { Router } from "express";
import puppeteer from "puppeteer";
import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
  getContactReport,
} from "../controllers/contact.js";



const contactRouter = Router();

contactRouter.post("/createContact", createContact);

contactRouter.get("/getContacts", getContacts);

contactRouter.get("/:id/getContact", getContactById);

contactRouter.patch("/:id/updateContact", updateContact);

contactRouter.delete("/:id/deleteContact", deleteContact);

//report

contactRouter.get( "/:id/report",getContactReport);

export default contactRouter;