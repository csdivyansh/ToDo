import express from "express";
import mongoose from "mongoose";
import {
  getTodos,
  updateTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
} from "../controllers/todo/todo.controller.js";
import { checkUsername } from "../controllers/user/user.controller.js";
import {
  signup,
  login,
  verifyToken,
} from "../controllers/auth/auth.controller.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    success: true,
    status: "API is running",
    mongodb: statusMap[mongoStatus] || "unknown",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/verify", verifyToken);

// User routes
router.get("/check-username/:userName", checkUsername);

// Todo routes
router.get("/todos/:userName", getTodos);
router.put("/todos/:userName", updateTodos);
router.post("/todos/:userName", addTodo);
router.delete("/todos/:userName/:index", deleteTodo);
router.patch("/todos/:userName/:index", toggleTodo);

export default router;
