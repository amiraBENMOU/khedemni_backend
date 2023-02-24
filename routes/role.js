import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRoles,
  getRolesByHierarchy,
  updateRole,
} from "../controllers/role";

import { roleMiddleware, authMiddleware } from "../middlewares";

const roleRouter = Router();

roleRouter.post("/super-admin/create", createRole);

roleRouter.get("/super-admin/get-roles", getRoles);
roleRouter.get("/super-admin/get-roles/:hierarchy", getRolesByHierarchy);

roleRouter.patch("/super-admin/update", updateRole);
roleRouter.delete("/super-admin/delete/:roleName", deleteRole);

export default roleRouter;
