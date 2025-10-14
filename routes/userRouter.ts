import express from "express";
import { updateProfile, deleteUser } from "../controllers/userController";
import { verifyUserToken } from "../middlewares/verifyToken";

const router = express.Router();

// Routes
router.post("/update/:id", verifyUserToken, updateProfile);
router.post("/delete/:id", verifyUserToken, deleteUser);

export default router;
