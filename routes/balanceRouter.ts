import express from "express";
import { getGroupBalances } from "../controllers/balanceController.ts";
import { verifyUserToken } from "../middlewares/verifyToken.ts";

const router = express.Router();

router.get("/groups/:groupId", verifyUserToken, getGroupBalances);

export default router;
