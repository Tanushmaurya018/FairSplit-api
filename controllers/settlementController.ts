import type { Request, Response } from "express";
import mongoose from "mongoose";
import Balance from "../models/balance";
import ApiError from "../utils/ApiError";

export const getSettlementSuggestions = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    if (!mongoose.isValidObjectId(groupId)) throw ApiError.badRequest("Invalid groupId");

    const balances = await Balance.find({ groupId })
      .populate("userId", "username email")
      .lean();

    if (!balances || balances.length === 0) {
      return res.status(200).json({ success: true, transactions: [], meta: { note: "No balances found" } });
    }

    const creditors: { user: any; amt: number }[] = [];
    const debtors: { user: any; amt: number }[] = [];

    for (const r of balances) {
      const cents = Math.round((r.balance || 0) * 100);
      if (cents > 0 && r.userId) creditors.push({ user: r.userId, amt: cents });
      else if (cents < 0 && r.userId) debtors.push({ user: r.userId, amt: -cents });
    }

    if (!creditors.length || !debtors.length) {
      return res.status(200).json({ success: true, transactions: [], meta: { note: "Nothing to settle" } });
    }

    creditors.sort((a, b) => b.amt - a.amt);
    debtors.sort((a, b) => b.amt - a.amt);

    const transactions: any[] = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amt, creditors[j].amt);

      transactions.push({
        from: { _id: debtors[i].user._id, username: debtors[i].user.username, email: debtors[i].user.email },
        to: { _id: creditors[j].user._id, username: creditors[j].user.username, email: creditors[j].user.email },
        amount: Number((pay / 100).toFixed(2)),
      });

      debtors[i].amt -= pay;
      creditors[j].amt -= pay;

      if (debtors[i].amt === 0) i++;
      if (creditors[j].amt === 0) j++;
    }

    const imbalanceCents = Math.abs(
      debtors.reduce((s, d) => s + d.amt, 0) - creditors.reduce((s, c) => s + c.amt, 0)
    );

    res.status(200).json({
      success: true,
      transactions,
      meta: { count: transactions.length, optimalGreedy: true, imbalance: Number((imbalanceCents / 100).toFixed(2)) },
    });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Failed to compute settlement suggestions" });
  }
};
