import Role from "../models/Role";

const roleMiddlewares =
  (...roles) =>
  async (req, res, next) => {
    const role = await Role.findById(req?.user?.roleID);

    if (!role) {
      return res.json({
        error: true,
        message: `Role ${role.roleName} don't exist`,
      });
    }

    if (role?.roleName === "super-admin" || roles.includes(role?.roleName)) {
      return next();
    } else {
      return res.json({
        error: true,
        message: `Only ${roles.join(", ")} have permission to do this action`,
      });
    }
  };

export default roleMiddlewares;
