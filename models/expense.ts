import mongoose, { Document, Schema, Model, model } from "mongoose";
import type { IExpense } from "../interfaces/expense.d.ts";

export interface IExpenseDocument extends IExpense, Document {}

const expenseSchema = new Schema<IExpenseDocument>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    payerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    title: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

const Expense: Model<IExpenseDocument> = model<IExpenseDocument>("Expense", expenseSchema);
export default Expense;
