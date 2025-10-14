import express from "express";
import { getSettlementSuggestions } from "../controllers/settlementController.js";
import { verifyUserToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/groups/:groupId/suggestions", verifyUserToken, getSettlementSuggestions);

export default router;
