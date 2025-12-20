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
let isConnecting = false;

const connectDB = async () => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If currently connecting, wait for it
  if (isConnecting) {
    await new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (
          mongoose.connection.readyState === 1 ||
          mongoose.connection.readyState === 0
        ) {
          clearInterval(checkConnection);
          resolve();
        }
      }, 100);
    });
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  }

  isConnecting = true;

  try {
    // Disconnect any existing connection first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log("Initiating MongoDB connection...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    // Verify connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection not ready after connect");
    }

    console.log(
      "MongoDB connected successfully. State:",
      mongoose.connection.readyState
    );
    cachedDb = mongoose.connection;
    isConnecting = false;
    return cachedDb;
  } catch (error) {
    isConnecting = false;
    cachedDb = null;
    console.error("MongoDB connection error:", error);
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
      console.error("MONGODB_URI environment variable is not set");
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("Attempting to connect to MongoDB...");
    await connectDB();
    console.log("MongoDB connection state:", mongoose.connection.readyState);

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
    console.error("MongoDB URI exists:", !!process.env.MONGODB_URI);
    console.error("MongoDB connection state:", mongoose.connection.readyState);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
