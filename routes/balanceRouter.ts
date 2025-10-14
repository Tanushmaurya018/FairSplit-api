import express from "express";
import { getGroupBalances } from "../controllers/balanceController.js";
import { verifyUserToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/groups/:groupId", verifyUserToken, getGroupBalances);

export default router;
