import { StatusCodes } from "http-status-codes";
import { BadRequestErrorAPI } from "../utils/errorAPI";
import { deleteImage, updateImage, uploadImage } from "../utils/image";
import Blog from "../models/Blog";

/************************** SUPER ADMIN | BLOG RESPONSIBLE ********************************/
export const createBlog = async (req, res) => {
  const { topic, description, content } = req.body;

  const userAuthor = req.user.userID;

  const image = req?.files?.image;
  const uploadedImage = await uploadImage(image, "aiesec/blogs");

  if (!topic || !description || !content) {
    throw new BadRequestErrorAPI("Please provide all values");
  }

  const blog = await Blog.create({
    topic,
    description,
    content,
    image: uploadedImage?.secure_url,
    userAuthor,
  });

  res.status(StatusCodes.CREATED).json(blog);
};

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find(req.query);
  res.status(StatusCodes.OK).json(blogs);
};

export const getBlogById = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  res.status(StatusCodes.OK).json(blog);
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;

  const { topic, description, content } = req.body;

  if (req.files) {
    const { image } = req.files;
    const blog = await Blog.findById(id);
    const updatedImage = await updateImage(image, blog.image, "aiesec/blogs");
    await Blog.findByIdAndUpdate(id, { image: updatedImage.secure_url });
  }

  const blog = await Blog.findByIdAndUpdate(
    id,
    {
      topic,
      description,
      content,
      image,
      userAuthor,
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json(blog);
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    throw new NotFoundErrorAPI("Blog not found");
  }

  await deleteImage(blog.image, "aiesec/blogs");

  res
    .status(StatusCodes.OK)
    .json({ message: `Blog ${blog.title} deleted with success.` });
};
