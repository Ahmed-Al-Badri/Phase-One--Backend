import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import goalRoutes from "./routes/goalRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import plaidRoutes from "./routes/plaidRoutes";
import chatRoutes from "./routes/chatRoutes";
// import { authenticateJWT } from "./middleware/auth";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/users/:userId/goals", goalRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/plaid", plaidRoutes);
app.use("/api/chat", chatRoutes);

export default app;
