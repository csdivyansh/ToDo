import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (origins configurable via CORS_ORIGINS env, comma-separated)
const defaultOrigins = [
  "https://todo.csdiv.tech",
  "https://todov.vercel.app",
  "http://localhost:5173",
  "http://localhost:5000",
];

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : defaultOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
    console.log("Connection state:", mongoose.connection.readyState);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(503).json({
      error: "Service temporarily unavailable",
      message: "Database connection failed",
    });
  }
});

// Routes
app.use("/api", todoRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Todo API Server is running" });
});

// Start server (not needed for Vercel, but useful for local dev)
if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

export default app;
