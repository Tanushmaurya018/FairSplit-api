import express from "express";
import { updateProfile, deleteUser } from "../controllers/userController.js";
import { verifyUserToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes
router.post("/update/:id", verifyUserToken, updateProfile);
router.post("/delete/:id", verifyUserToken, deleteUser);

export default router;
