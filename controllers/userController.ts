import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.ts";
import ApiError from "../utils/ApiError.ts";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (String(req.user?._id) !== String(id)) throw ApiError.forbidden("You can only update your own account");

    let { username, email, photoURL, password } = req.body;
    if (email) email = email.trim().toLowerCase();

    let hashedPassword;
    if (password) {
      if (password.length < 6) throw ApiError.badRequest("Password must be at least 6 characters");
      hashedPassword = await bcrypt.hash(password);
    }

    if (email) {
      const dup = await User.findOne({ email });
      if (dup && String(dup._id) !== String(id)) throw ApiError.badRequest("This email is already registered");
    }

    const set: Record<string, any> = {};
    if (username !== undefined) set.username = username;
    if (email !== undefined) set.email = email;
    if (photoURL !== undefined) set.photoURL = photoURL;
    if (hashedPassword) set.password = hashedPassword;

    if (Object.keys(set).length === 0) throw ApiError.badRequest("No fields to update");

    const updatedUser = await User.findByIdAndUpdate(id, { $set: set }, { new: true });
    if (!updatedUser) throw ApiError.notFound("User not found");

    const { password: _pw, ...userWoPassword } = updatedUser.toObject();
    res.status(200).json({ success: true, message: "User updated", user: userWoPassword });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to update profile" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (String(req.user?._id) !== String(id)) throw ApiError.forbidden("You can only delete your own account");

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) throw ApiError.notFound("User not found");

    res.clearCookie("access_token", {
      httpOnly: true,
    }).status(200).json({ success: true, message: "Account deleted" });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to delete account" });
  }
};
