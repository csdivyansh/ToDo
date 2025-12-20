import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import Todo from "../../models/todo.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRES_IN = "7d";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const signup = async (req, res) => {
  try {
    const { userName, name, password } = req.body;

    // Validation
    if (!userName || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (userName.length < 3 || userName.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3 and 20 characters",
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernameRegex.test(userName)) {
      return res.status(400).json({
        success: false,
        message:
          "Username can only contain letters, numbers, underscore, and hyphen",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Create new user
    const user = new User({
      userName,
      name,
      password,
    });

    await user.save();

    // Create initial todos for the user
    const defaultTodos = [
      { text: "Welcome to csdiv's todos list app", completed: false },
      { text: "Start making your day productive", completed: false },
    ];

    const todoDoc = new Todo({
      userName,
      todos: defaultTodos,
      lastOpenDate: new Date(),
    });

    await todoDoc.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: {
          userName: user.userName,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Validation
    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          userName: user.userName,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          userName: user.userName,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
