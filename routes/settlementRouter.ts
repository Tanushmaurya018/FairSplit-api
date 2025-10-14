import express from "express";
import { getSettlementSuggestions } from "../controllers/settlementController";
import { verifyUserToken } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/groups/:groupId/suggestions", verifyUserToken, getSettlementSuggestions);

export default router;
