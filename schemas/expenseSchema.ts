import { z } from "zod";

export const addExpenseSchema = z.object({
  title: z.string().trim(),
  amount: z.union([z.number(), z.string()]).transform((v) => {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n) || n <= 0) throw new Error("amount must be > 0");
    return Math.round(n * 100) / 100;
  }),
  payerId: z.string(),
  participants: z.array(z.string().min(1)),
});
export type AddExpenseInput = z.infer<typeof addExpenseSchema>;
