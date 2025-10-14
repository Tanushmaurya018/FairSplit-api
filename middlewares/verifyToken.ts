import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.ts";
import type { AuthRequest } from "../interfaces/auth.d.ts";

export const verifyUserToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      throw ApiError.unauthorized("Sign in to your account to continue");
    }

    const payload = jwt.verify(token, process.env.TOKEN_SECRET as string) as string | jwt.JwtPayload;
    if (!payload) {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    req.user = payload;
    next();
  } catch (err: any) {
    const status = err.statusCode || 401;
    res.status(status).json({
      success: false,
      message: err.message || "Unauthorized",
    });
  }
};
