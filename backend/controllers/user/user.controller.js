import Todo from "../../models/todo.model.js";

export const checkUsername = async (req, res) => {
  try {
    const { userName } = req.params;

    // Validate username format
    if (!userName || userName.length < 3 || userName.length > 20) {
      return res.status(400).json({
        available: false,
        message: "Username must be between 3 and 20 characters",
      });
    }

    // Check if username contains only valid characters (alphanumeric, underscore, hyphen)
    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernameRegex.test(userName)) {
      return res.status(400).json({
        available: false,
        message:
          "Username can only contain letters, numbers, underscore, and hyphen",
      });
    }

    // Check if username already exists
    const existingUser = await Todo.findOne({ userName });

    if (existingUser) {
      return res.json({
        available: false,
        message: "Username is already taken",
      });
    }

    res.json({
      available: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({
      available: false,
      message: "Error checking username availability",
    });
  }
};
