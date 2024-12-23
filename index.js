import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import connectServer from "./config/server.js";
import notFoundRoute from "./middlewares/notFoundRoute.js";
import errorHandler from "./middlewares/errorHandler.js";
import contactRouter from "./routes/contact.js";

const app = express();

//middelware
app.use(cors());
app.options("*", cors()); // For preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/contact", contactRouter);
app.get("/", async (req, res) => {
  res.json({ message: "Hello world" });
});

// Catch-all for undefined routes
app.use(notFoundRoute);

// Error handling
app.use(errorHandler);



app.use(errorHandler);
app.use(notFoundRoute);

// Connection
connectDB();
connectServer(app);
