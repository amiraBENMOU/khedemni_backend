import { Router } from "express";

import {
  signUp,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  signIn,
} from "../controllers/user.js";



const userRouter = Router();

userRouter.post("/signUp", signUp);

userRouter.post("/signIn", signIn);

userRouter.get("/getUsers", getUsers);

userRouter.get("/:id/getUser", getUserById);

userRouter.patch("/:id/updateUser", updateUser);

userRouter.delete("/:id/deleteUser", deleteUser);


export default userRouter;