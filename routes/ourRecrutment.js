import express from "express";

// Initialize express router
import {
    createPosition,
    getPositions,
    getPositionById,
    updatePosition,
    deletePosition,
    uploadFile,
} from "../controllers/ourRecrutment.js";
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const upload = multer({ storage: storage });
  


// Create a new router
const positionRouter = express.Router();

positionRouter.post("/createPosition", createPosition);

positionRouter.get("/getPositions", getPositions);
//uploadFile
positionRouter.post("/upload",upload.single('file'), uploadFile);

positionRouter.get("/:id", getPositionById);

positionRouter.put("/:id", updatePosition);

positionRouter.delete("/:id", deletePosition);



export default positionRouter;