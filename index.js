import "express-async-errors";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import connectServer from "./config/server.js";
import notFoundRoute from "./middlewares/notFoundRoute.js";
import errorHandler from "./middlewares/errorHandler.js";
import contactRouter from "./routes/contact.js";
import { engine } from "express-handlebars";
import userRouter from "./routes/user.js";
import companyRouter from "./routes/company.js";
//file upload 
import fileUpload from "express-fileupload";


export const app = express();

// hbs 
app.engine("hbs", engine({ extname: '.hbs' }));
app.set("view engine", "hbs");


//middelware
app.use(cors());
app.use(express.json({limit: "25mb"}));
app.use(express.urlencoded({ extended: true , limit:"25mb" }));
//TO UPLOAD FILES
app.use(fileUpload({ useTempFiles: true }));
// Routes
app.use("/contact", contactRouter);
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.get("/", async (req, res) => {
  res.json({ message: "Hello world" });
});


// Middlewares
app.use(errorHandler);
app.use(notFoundRoute);

// Connection
connectDB();
connectServer(app);
