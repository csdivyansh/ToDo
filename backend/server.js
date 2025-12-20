import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    "https://todo.csdiv.tech",
    "https://todov.vercel.app",
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

// Routes
app.use("/api", todoRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Todo API Server is running" });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");
    console.log("Connection state:", mongoose.connection.readyState);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
