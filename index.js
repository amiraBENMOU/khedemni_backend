import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import connectServer from "./config/server.js";
import notFoundRoute from "./middlewares/notFoundRoute.js";
import errorHandler from "./middlewares/errorHandler.js";
import contactRouter from "./routes/contact.js";
import { engine } from "express-handlebars";


const app = express();

// hbs 
app.engine("hbs", engine({ extname: '.hbs' }));
app.set("view engine", "hbs");


//middelware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/contact", contactRouter);
app.get("/", async (req, res) => {
  res.json({ message: "Hello world" });
});


// Middlewares
app.use(errorHandler);
app.use(notFoundRoute);

// Connection
connectDB();
connectServer(app);
