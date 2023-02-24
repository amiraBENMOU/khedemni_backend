import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const createJwt = (userID, roleID) => {
  return jwt.sign({ userID, roleID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export const comparePassword = async (potentialPassword, realPassword) => {
  return await bcrypt.compare(potentialPassword, realPassword);
};
