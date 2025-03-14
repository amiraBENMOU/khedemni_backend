import { Router } from "express";
import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
  getContactReport,
  fetchUsersWithContacts,
} from "../controllers/contact.js";



const contactRouter = Router();

contactRouter.post("/createContact", createContact);

contactRouter.get("/getContacts", getContacts);

contactRouter.get("/:id/getContact", getContactById);

contactRouter.patch("/:id/updateContact", updateContact);

contactRouter.delete("/:id/deleteContact", deleteContact);

contactRouter.get("/fetchUserContact", fetchUsersWithContacts);

//report

contactRouter.get( "/:id/report",getContactReport);

export default contactRouter;