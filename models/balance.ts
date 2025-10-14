import mongoose, { Document, Schema, Model, model } from "mongoose";
import type { IBalance } from "../interfaces/balance.d.ts";

export interface IBalanceDocument extends IBalance, Document {}

const balanceSchema = new Schema<IBalanceDocument>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true },
  },
  { timestamps: true }
);

const Balance: Model<IBalanceDocument> = model<IBalanceDocument>("Balance", balanceSchema);
export default Balance;
