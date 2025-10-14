import express from "express";
import { addExpense, getExpenses, deleteExpense } from "../controllers/expenseController.ts";
import { verifyUserToken } from "../middlewares/verifyToken.ts";

const router = express.Router();

router.post("/groups/:groupId", verifyUserToken, addExpense);
router.get("/groups/:groupId", verifyUserToken, getExpenses);
router.delete("/:expenseId", verifyUserToken, deleteExpense);

export default router;
