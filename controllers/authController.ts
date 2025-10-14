import dotenv from "dotenv";

dotenv.config();

import type { Request, Response } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const SALT_ROUNDS = Number(process.env.SALT) || 10;

function jwtSign(payload: object, opts = {}) {
  return jwt.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: "30d", ...opts });
}

export const signup = async (req: Request, res: Response) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password || password.length < 6) {
      throw ApiError.badRequest("Invalid input");
    }

    email = email.trim().toLowerCase();

    if (await User.findOne({ email })) {
      throw ApiError.badRequest("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({ username, email, password: hashedPassword });
    const token = jwtSign({ _id: newUser._id });

    const { password: _pw, ...userWoPassword } = newUser.toObject();

    res.cookie("access_token", token, { httpOnly: true }).status(201).json({
      success: true,
      message: "User created",
      user: userWoPassword,
    });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) throw ApiError.badRequest("Email and password required");

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) throw ApiError.unauthorized("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw ApiError.unauthorized("Invalid credentials");

    const token = jwtSign({ _id: user._id });

    const userWoPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      photoURL: user.photoURL,
    };

    res.cookie("access_token", token).status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userWoPassword,
    });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Login failed" });
  }
};

// export const google = async (req: Request, res: Response) => {
//   try {
//     let { username, email, photoURL } = req.body;
//     if (!email) throw ApiError.badRequest("Email is required");

//     email = email.trim().toLowerCase();
//     let user = await User.findOne({ email });

//     if (!user) {
//       const randomPass = Math.random().toString(36).slice(2);
//       const hashedPassword = await bcrypt.hash(randomPass, BCRYPT_ROUNDS);

//       user = await User.create({
//         username: username || email.split("@")[0],
//         email,
//         password: hashedPassword,
//         photoURL,
//       });
//     }

//     const token = jwtSign({ _id: user._id });

//     const userWoPassword = {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       photoURL: user.photoURL,
//     };

//     res.cookie("access_token", token, authCookie()).status(200).json({
//       success: true,
//       message: "Authenticated successfully",
//       user: userWoPassword,
//     });
//   } catch (err: any) {
//     res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Google auth failed" });
//   }
// };

export const logOut = (req: Request, res: Response) => {
  try {
    console.log("vkevej")
    res.clearCookie("access_token", {
      httpOnly: true,
    }).status(200).json({ success: true, message: "Logged out" });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Logout failed" });
  }
};
