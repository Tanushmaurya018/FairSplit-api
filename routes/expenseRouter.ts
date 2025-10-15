import express from "express";
import { addExpense, getExpenses, deleteExpense } from "../controllers/expenseController";
import { verifyUserToken } from "../middlewares/verifyToken";
import { validate } from "../lib/validate";
import { addExpenseSchema } from "../schemas/expenseSchema";

const router = express.Router();

router.post("/groups/:groupId", verifyUserToken, validate({ body: addExpenseSchema }),addExpense);
router.get("/groups/:groupId", verifyUserToken, getExpenses);
router.delete("/:expenseId", verifyUserToken, deleteExpense);

export default router;
