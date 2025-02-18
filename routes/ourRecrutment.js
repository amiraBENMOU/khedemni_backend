import { Router } from "express";
import {
    createPosition,
    getPositions,
    getPositionById,
    updatePosition,
    deletePosition,

} from "../controllers/ourRecrutment.js";



const positionRouter = express.Router();

positionRouter.post("/", createPosition);
positionRouter.get("/", getPositions);
positionRouter.get("/:id", getPositionById);
positionRouter.put("/:id", updatePosition);
positionRouter.delete("/:id", deletePosition);

export default positionRouter;

