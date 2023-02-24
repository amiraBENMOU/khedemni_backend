import { model, Schema } from "mongoose";

const roleSchema = new Schema({
  roleName: {
    type: String,
    default: "no-role",
    unique : true
  },
  hierarchy: {
    type: Number,
    default: 0,
  },
});

export default model("Role", roleSchema);
