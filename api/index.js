import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoRoutes from "../backend/routes/todo.routes.js";

const app = express();

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
let connectionPromise = null;

const connectDB = async () => {
  // If already connected and ready, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If there's an ongoing connection attempt, wait for it
  if (connectionPromise) {
    await connectionPromise;
    return mongoose.connection;
  }

  // Create a new connection promise
  connectionPromise = (async () => {
    try {
      // Disconnect any existing connection first
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }

      console.log("Initiating MongoDB connection...");

      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      });

      // Wait for connection to be fully ready
      await new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
          resolve();
        } else {
          mongoose.connection.once("connected", resolve);
          mongoose.connection.once("error", reject);
          // Timeout after 5 seconds
          setTimeout(() => reject(new Error("Connection timeout")), 5000);
        }
      });

      console.log(
        "MongoDB connected successfully. State:",
        mongoose.connection.readyState
      );
      cachedDb = mongoose.connection;
      return cachedDb;
    } catch (error) {
      cachedDb = null;
      console.error("MongoDB connection error:", error);
      throw error;
    } finally {
      connectionPromise = null;
    }
  })();

  await connectionPromise;
  return mongoose.connection;
};

// Serverless function handler
export default async function handler(req, res) {
  // Set CORS headers explicitly for Vercel
  const origin = req.headers.origin;

  if (corsOptions.origin.includes(origin)) {
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
