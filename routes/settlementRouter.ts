import express from "express";
import { getSettlementSuggestions } from "../controllers/settlementController.ts";
import { verifyUserToken } from "../middlewares/verifyToken.ts";

const router = express.Router();

router.get("/groups/:groupId/suggestions", verifyUserToken, getSettlementSuggestions);

export default router;
