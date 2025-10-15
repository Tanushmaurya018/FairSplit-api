import express from "express";
import { login, signup, logOut } from "../controllers/authController";
import { validate } from "../lib/validate";
import { loginSchema, signupSchema } from "../schemas/authSchema";

const router = express.Router();

router.post("/signup", validate({ body: signupSchema }), signup);
router.post("/login",  validate({ body: loginSchema  }), login);

router.post("/logout", logOut);
// router.post("/google", google);

export default router;
