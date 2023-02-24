import "dotenv/config";
import jwt from "jsonwebtoken";
import { UnAuthorizedErrorAPI } from "../utils/errorAPI";

export default async function authMiddleware(req, res, next) {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    throw new UnAuthorizedErrorAPI("Authentication invalid");
  }
  const token = authHeaders.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userID: payload.userID, roleID: payload.roleID };
  } catch (error) {
    throw new UnAuthorizedErrorAPI("Authentication invalid");
  }
  next();
}
