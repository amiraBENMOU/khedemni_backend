import { Router } from "express";
import {
  attributeRole,
  deleteUser,
  getAllUsers,
  getUserInfo,
  login,
  register,
  updateUser,
  updatePasswordUser,
} from "../controllers/user";
import { roleMiddleware, authMiddleware } from "../middlewares";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/info", [authMiddleware], getUserInfo);

userRouter.get(
  "/super-admin/get-all-users",
  [authMiddleware, roleMiddleware("super-admin")],
  getAllUsers
);

userRouter.delete(
  "/super-admin/delete/:id",
  [authMiddleware, roleMiddleware("super-admin")],
  deleteUser
);

userRouter.post("/attribute-role", [authMiddleware], attributeRole);

userRouter.patch("/update", [authMiddleware], updateUser);
userRouter.patch("/update-password", [authMiddleware], updatePasswordUser);

export default userRouter;
