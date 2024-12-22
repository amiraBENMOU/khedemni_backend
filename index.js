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


app.use(cors());
app.options("*", cors());
app.use(express.json());


// Routes
app.get("/", async (req, res) => {
  res.json({ message: "  Hello world " });
});

app.use("/contact", contactRouter);

// Catch-all for routes that do not exist
app.use((req, res) => {
  res.status(404).json({ message: "Route doesn't exist" });
});

app.use(errorHandler);
app.use(notFoundRoute);

// Connection
connectDB();
connectServer(app);
