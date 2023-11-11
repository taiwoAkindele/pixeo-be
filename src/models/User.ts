import * as mongoose from "mongoose";
import { model } from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  emailVerified: { type: Boolean, required: true, default: false },
  emailToken: { type: String, required: true },
  emailTokenExp: { type: Date, required: true },
  resetPasswordToken: { type: String, required: false },
  resetPasswordTokenTime: { type: Date, required: false },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  fullName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

export default model("users", userSchema);
