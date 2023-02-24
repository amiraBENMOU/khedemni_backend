import { StatusCodes } from "http-status-codes";
import Role from "../models/Role";
import User from "../models/User";
import {
  BadRequestErrorAPI,
  NotFoundErrorAPI,
  UnAuthorizedErrorAPI,
} from "../utils/errorAPI";
import { comparePassword, createJwt } from "../utils/jwt";
import bcrypt from "bcryptjs";

/************************** PUBLIC ********************************/
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestErrorAPI("Please provide all values");
  }

  let role = await Role.findOne({ roleName: "no-role" });

  if (!role) {
    role = await Role.create();
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role._id,
  });

  user.password = undefined;
  const token = createJwt(user._id, role._id);

  res.status(201).json({ user, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestErrorAPI("Please provide all values");
  }

  const user = await User.findOne({ email }).populate("role");
  if (!user) {
    throw new BadRequestErrorAPI("Invalid Email");
  }

  const isPasswordMatch = await comparePassword(password, user.password);

  if (!isPasswordMatch) {
    throw new UnAuthorizedErrorAPI("Invalid Password !");
  }

  // All good
  user.password = undefined;
  const token = createJwt(user._id, user.role._id);

  res.status(StatusCodes.OK).json({ user, token });
};

export const getUserInfo = async (req, res) => {
  const { userID } = req.user;

  const user = await User.findById(userID).select("-password").populate("role");
  res.status(StatusCodes.OK).json(user);
};

/************************** SUPER ADMIN ********************************/
export const getAllUsers = async (req, res) => {
  const users = await User.find(req.query).select("-password").populate("role");

  res.status(StatusCodes.BAD_GATEWAY).json(users);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const { deletedCount } = await User.deleteOne({ _id: id });

  if (!deletedCount) {
    throw new NotFoundErrorAPI("User not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User deleted with succes",
  });
};

export const attributeRole = async (req, res) => {
  const { id, roleName } = req.body;

  if (!id || !roleName) {
    throw new BadRequestErrorAPI("Please provide all values");
  }

  const roleToAttribute = await Role.findOne({ roleName });

  const userToAttributeRole = await User.findById(id).populate("role");
  console.log(roleToAttribute, userToAttributeRole);
  if (!userToAttributeRole) {
    throw new NotFoundErrorAPI("User not found");
  }

  if (!roleToAttribute) {
    throw new NotFoundErrorAPI("Role not found");
  }

  const { roleID } = req.user;
  const myRole = await Role.findById(roleID);
  console.log(myRole);

  if (myRole.hierarchy <= userToAttributeRole.role.hierarchy) {
    throw new UnAuthorizedErrorAPI("You can't change role for this person");
  }

  if (myRole.hierarchy <= roleToAttribute.hierarchy) {
    throw new UnAuthorizedErrorAPI(
      "You can't attribute a role higher than your"
    );
  }

  userToAttributeRole.role = roleToAttribute._id;
  await userToAttributeRole.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Gave ${roleName} to ${userToAttributeRole.name} with succes`,
  });
};

export const updateUser = async (req, res) => {
  const { userID } = req.user;
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    userID,
    { name, email },
    { new: true }
  );
  res.status(StatusCodes.OK).json(user);
};

export const updatePasswordUser = async (req, res) => {
  const { userID } = req.user;
  const { oldPassword, newPassword } = req.body;

  // Vérifier que l'utilisateur existe dans la base de données
  const user = await User.findById(userID);

  if (!user) {
    throw new NotFoundErrorAPI("User not found");
  }

  // Vérifier que l'ancien mot de passe est correct
  const isPasswordMatch = await comparePassword(oldPassword, user.password);
  console.log(isPasswordMatch);
  if (!isPasswordMatch) {
    throw new UnAuthorizedErrorAPI("Invalid password");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    await bcrypt.genSalt(10)
  );

  await User.findByIdAndUpdate(userID, { password: hashedPassword });

  res.json({ message: "Password successfully updated" });
};
