import express from "express";
import { getGroupBalances } from "../controllers/balanceController";
import { verifyUserToken } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/groups/:groupId", verifyUserToken, getGroupBalances);

export default router;
