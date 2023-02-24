import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/event";

const eventRouter = Router();

eventRouter.post("/create-event", createEvent);

eventRouter.get("/get-events", getEvents);

eventRouter.get("/get-events/:id", getEventById);

eventRouter.patch("/update-event/:id", updateEvent);

eventRouter.delete("/delete-event/:id", deleteEvent);

export default eventRouter;
