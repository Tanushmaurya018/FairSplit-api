import type { Request, Response } from "express";
import Expense from "../models/expense";
import Balance from "../models/balance";
import ApiError from "../utils/ApiError";

async function bumpBalance(groupId: string, userId: string, delta: number) {
  await Balance.findOneAndUpdate(
    { groupId, userId },
    { $inc: { balance: delta } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function applyExpense(exp: any) {
  const participants = exp.participants || [];
  if (!participants.length || exp.amount <= 0) return;

  const share = exp.amount / participants.length;

  for (const pid of participants) {
    if (String(pid) !== String(exp.payerId)) {
      await bumpBalance(exp.groupId, exp.payerId, +share);
      await bumpBalance(exp.groupId, pid, -share);
    }
  }
}

async function reverseExpense(exp: any) {
  const participants = exp.participants || [];
  if (!participants.length || exp.amount <= 0) return;

  const share = exp.amount / participants.length;

  for (const pid of participants) {
    if (String(pid) !== String(exp.payerId)) {
      await bumpBalance(exp.groupId, exp.payerId, -share);
      await bumpBalance(exp.groupId, pid, +share);
    }
  }
}

export const addExpense = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { payerId, amount, participants, title } = req.body;

    if (!groupId) throw ApiError.badRequest("Group ID is required");
    if (!payerId) throw ApiError.badRequest("payerId is required");

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) throw ApiError.badRequest("Amount must be positive");
    if (!Array.isArray(participants) || !participants.length) throw ApiError.badRequest("Participants required");

    const expense = await Expense.create({ groupId, payerId, amount: amt, participants, title });

    await applyExpense(expense);

    const populatedExpense = await Expense.findById(expense._id)
      .populate("payerId", "username email")
      .populate("participants", "username email");

    res.status(201).json({ success: true, data: populatedExpense });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to create expense" });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    if (!groupId) throw ApiError.badRequest("Group ID is required");

    const list = await Expense.find({ groupId })
      .populate("payerId", "username email")
      .populate("participants", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to fetch expenses" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    if (!expenseId) throw ApiError.badRequest("Expense ID is required");

    const exp = await Expense.findById(expenseId);
    if (!exp) throw ApiError.notFound("Expense not found");

    await reverseExpense(exp);
    await Expense.findByIdAndDelete(exp._id);

    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to delete expense" });
  }
};
