import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "../controllers/blog";

const blogRouter = Router();

blogRouter.post("/create-blog", createBlog);

blogRouter.get("/get-blogs", getBlogs);

blogRouter.get("/get-blogs/:id", getBlogById);

blogRouter.patch("/update-blog/:id", updateBlog);

blogRouter.delete("/delete-blog/:id", deleteBlog);

export default blogRouter;
