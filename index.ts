import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import Database from "./db.ts"; // use the singleton

import userRouter from "./routes/userRouter.ts";
import authRouter from "./routes/authRouter.ts";
import groupRouter from "./routes/groupRouter.ts";
import expenseRouter from "./routes/expenseRouter.ts";
import balanceRouter from "./routes/balanceRouter.ts";
import settlementRouter from "./routes/settlementRouter.ts";

const app = express();
// Initialize DB connection via singleton
Database.getInstance();
console.log("heheheh")

app.use(express.json());
const FRONTEND_URL = process.env.FRONTEND_URL || "https://your-frontend.onrender.com";
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/group", groupRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/balance", balanceRouter);
app.use("/api/settlement", settlementRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
