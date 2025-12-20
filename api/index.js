import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoRoutes from "../backend/routes/todo.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/misc", todoRoutes);

// MongoDB connection
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Serverless function handler
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
