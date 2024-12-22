import { Router } from "express";
import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from "../controllers/contact.js";

const contactRouter = Router();

contactRouter.post("/createContact", createContact);

contactRouter.get("/getContacts", getContacts);

contactRouter.get("/getContact/:id", getContactById);

contactRouter.patch("/updateContact/:id", updateContact);

contactRouter.delete("/deleteContact/:id", deleteContact);

export default contactRouter;
