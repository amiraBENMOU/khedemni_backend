import express from "express";

// Initialize express router
import {
    createPosition,
    getPositions,
    getPositionById,
    updatePosition,
    deletePosition,
} from "../controllers/ourRecrutment.js";

// Create a new router
const positionRouter = express.Router();

positionRouter.post("/createPosition", createPosition);

positionRouter.get("/getPositions", getPositions);

positionRouter.get("/:id", getPositionById);

positionRouter.put("/:id", updatePosition);

positionRouter.delete("/:id", deletePosition);

export default positionRouter;