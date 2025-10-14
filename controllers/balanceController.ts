import type { Request, Response } from "express";
import Balance from "../models/balance.ts";
import ApiError from "../utils/ApiError.ts";

export const getGroupBalances = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    if (!groupId) throw ApiError.badRequest("Group ID is required");

    const rows = await Balance.find({ groupId })
      .populate("userId", "username email")
      .populate("groupId", "name");

    if (!rows || rows.length === 0) throw ApiError.notFound("No balances found for this group");

    res.status(200).json({ success: true, data: rows });
  } catch (err: any) {
    res.status(err?.statusCode || 500).json({ success: false, message: err?.message || "Something went wrong" });
  }
};
