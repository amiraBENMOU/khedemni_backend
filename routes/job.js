import { Router } from "express";
import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob

} from "../controllers/job.js";


const jobRouter = express.Router();

jobRouter.post("/", createJob);
jobRouter.get("/", getJobs);
jobRouter.get("/:id", getJobById);
jobRouter.put("/:id", updateJob);
jobRouter.delete("/:id", deleteJob);

export default jobRouter;

