import mongoose, { Document, Schema, Model, model } from "mongoose";
import type { IUser } from "../interfaces/user.d";

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photoURL: {
      type: String,
      default: "https://img.freepik.com/premium-vector/avatar-profile-icon_188544-4755.jpg?w=740",
    },
  },
  { timestamps: true }
);

const User: Model<IUserDocument> = model<IUserDocument>("User", userSchema);
export default User;
