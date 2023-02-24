import { StatusCodes } from "http-status-codes";
import Role from "../models/Role";
import { BadRequestErrorAPI, NotFoundErrorAPI } from "../utils/errorAPI";

/************************** SUPER ADMIN ********************************/
export const createRole = async (req, res) => {
  const { roleName, hierarchy } = req.body;

  const role = await Role.create({
    roleName,
    hierarchy,
  });

  if (!role) {
    throw new BadRequestErrorAPI("Role not created");
  }

  res.status(201).json({
    success: true,
    message: `Role ${role.roleName} created successfully`,
  });
};

export const getRoles = async (req, res) => {
  const roles = await Role.find(req.query);
  res.status(StatusCodes.OK).json(roles);
};

export const getRolesByHierarchy = async (req, res) => {
  const { hierarchy } = req.params;
  const role = await Role.find({ hierarchy: { $gte: hierarchy } });
  if (!role) {
    throw new NotFoundErrorAPI("Roles not found");
  }
  res.status(StatusCodes.OK).json(role);
};

export const updateRole = async (req, res) => {
  const { oldName, roleName, hierarchy } = req.body;

  const role = await Role.findOneAndUpdate(
    { roleName: oldName },
    {
      roleName,
      hierarchy,
    },
    { new: true }
  );

  if (!role) {
    throw new NotFoundErrorAPI("Role not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Role ${oldName} is now ${role.roleName}.`,
  });
};

export const deleteRole = async (req, res) => {
  const { roleName } = req.params;

  const role = await Role.findOne({ roleName });

  if (!role) {
    throw new NotFoundErrorAPI("Role not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Role ${roleName} deleted successfully`,
  });
};
