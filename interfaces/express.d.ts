import type { Request } from "express";
import type { IUserDocument } from "../models/user.interface.ts"; // optional: if you have a User interface

declare module "express-serve-static-core" {
  interface Request {
    user?: IUserDocument | { _id: string }; // whatever you store in JWT payload
  }
}
