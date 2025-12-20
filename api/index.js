import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoRoutes from "../backend/routes/todo.routes.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "https://todo.csdiv.tech",
    "http://localhost:5173",
    "http://localhost:5000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON",
    });
  }
  next();
});

// Routes - mount at root
app.use("/", todoRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  console.log("404 - Route not found:", req.method, req.url);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// MongoDB connection with caching
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  // Disable buffering for serverless
  mongoose.set("bufferCommands", false);

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    cachedDb = db;

    // Wait for connection to be fully ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection not ready");
    }

    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    cachedDb = null; // Reset cache on error
    throw error;
  }
};

// Serverless function handler
export default async function handler(req, res) {
  // Set CORS headers explicitly for Vercel
  const origin = req.headers.origin;
  const allowedOrigins = [
    "https://todo.csdiv.tech",
    "http://localhost:5173",
    "http://localhost:5000",
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    await connectDB();

    // Strip /api prefix if present for Express routing
    if (req.url.startsWith("/api")) {
      req.url = req.url.replace("/api", "");
      if (req.url === "") req.url = "/";
    }

    console.log("Processing request:", req.method, req.url);

    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    console.error("Error stack:", error.stack);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
