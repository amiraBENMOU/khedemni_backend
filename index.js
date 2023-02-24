import "express-async-errors";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import connectServer from "./config/server.js";
import notFoundRoute from "./middlewares/notFoundRoute.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.js";
import roleRouter from "./routes/role.js";
import blogRouter from "./routes/blog.js";
import { authMiddleware, roleMiddleware } from "./middlewares/index.js";

import eventRouter from "./routes/event.js";
import fileUpload from "express-fileupload";

const app = express();

// Middlewares
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.get("/", async (req, res) => {
  res.json({ message: "السلام عليكم ورحمة الله وبركاته" });
});

app.use("/api/v1/user", userRouter);
app.use(
  "/api/v1/role",
  [authMiddleware, roleMiddleware("super-admin")],
  roleRouter
);
app.use(
  "/api/v1/event",
  [
    authMiddleware,
    roleMiddleware("event-responsible", "event-sub-responsible"),
  ],
  eventRouter
);
app.use(
  "/api/v1/blog",
  [authMiddleware, roleMiddleware("blog-responsible", "blog-sub-responsible")],
  blogRouter
);

app.use(errorHandler);
app.use(notFoundRoute);

// Connection
connectDB();
connectServer(app);
