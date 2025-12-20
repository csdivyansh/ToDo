import Todo from "../../models/todo.model.js";

export const getTodos = async (req, res) => {
  try {
    const { userName } = req.params;

    let todoDoc = await Todo.findOne({ userName });

    const today = new Date().toDateString();

    if (!todoDoc) {
      // Create new todo document with default todos if doesn't exist
      const defaultTodos = [
        { text: "Welcome to csdiv's todos list app", completed: false },
        { text: "Start making your day productive", completed: false },
        { text: "CF", completed: false },
        { text: "LC", completed: false },
        { text: "HS", completed: false },
        { text: "CH", completed: false },
        { text: "BG", completed: false },
      ];

      todoDoc = new Todo({
        userName,
        todos: defaultTodos,
        lastOpenDate: new Date(),
      });
      await todoDoc.save();
    } else {
      // Check if it's a new day - reset all completed tasks
      const lastOpen = todoDoc.lastOpenDate
        ? new Date(todoDoc.lastOpenDate).toDateString()
        : null;

      if (lastOpen && lastOpen !== today) {
        todoDoc.todos = todoDoc.todos.map((todo) => ({
          ...todo,
          completed: false,
        }));
      }

      // Update lastOpenDate
      todoDoc.lastOpenDate = new Date();
      await todoDoc.save();
    }

    res.json({
      userName: todoDoc.userName,
      todos: todoDoc.todos,
      lastOpenDate: todoDoc.lastOpenDate,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const updateTodos = async (req, res) => {
  try {
    const { userName } = req.params;
    const { todos } = req.body;

    if (!Array.isArray(todos)) {
      return res.status(400).json({ error: "Todos must be an array" });
    }

    let todoDoc = await Todo.findOne({ userName });

    if (!todoDoc) {
      todoDoc = new Todo({
        userName,
        todos,
        lastOpenDate: new Date(),
      });
    } else {
      todoDoc.todos = todos;
      todoDoc.lastOpenDate = new Date();
    }

    await todoDoc.save();

    res.json({
      userName: todoDoc.userName,
      todos: todoDoc.todos,
      lastOpenDate: todoDoc.lastOpenDate,
    });
  } catch (error) {
    console.error("Error updating todos:", error);
    res.status(500).json({ error: "Failed to update todos" });
  }
};

export const addTodo = async (req, res) => {
  try {
    const { userName } = req.params;
    const { text, completed = false } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Todo text is required" });
    }

    let todoDoc = await Todo.findOne({ userName });

    if (!todoDoc) {
      todoDoc = new Todo({
        userName,
        todos: [{ text, completed }],
        lastOpenDate: new Date(),
      });
    } else {
      todoDoc.todos.push({ text, completed });
      todoDoc.lastOpenDate = new Date();
    }

    await todoDoc.save();

    res.json({
      userName: todoDoc.userName,
      todos: todoDoc.todos,
      lastOpenDate: todoDoc.lastOpenDate,
    });
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Failed to add todo" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { userName, index } = req.params;

    const todoDoc = await Todo.findOne({ userName });

    if (!todoDoc) {
      return res.status(404).json({ error: "Todos not found" });
    }

    const todoIndex = parseInt(index);
    if (todoIndex < 0 || todoIndex >= todoDoc.todos.length) {
      return res.status(400).json({ error: "Invalid todo index" });
    }

    todoDoc.todos.splice(todoIndex, 1);
    todoDoc.lastOpenDate = new Date();
    await todoDoc.save();

    res.json({
      userName: todoDoc.userName,
      todos: todoDoc.todos,
      lastOpenDate: todoDoc.lastOpenDate,
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

export const toggleTodo = async (req, res) => {
  try {
    const { userName, index } = req.params;

    const todoDoc = await Todo.findOne({ userName });

    if (!todoDoc) {
      return res.status(404).json({ error: "Todos not found" });
    }

    const todoIndex = parseInt(index);
    if (todoIndex < 0 || todoIndex >= todoDoc.todos.length) {
      return res.status(400).json({ error: "Invalid todo index" });
    }

    todoDoc.todos[todoIndex].completed = !todoDoc.todos[todoIndex].completed;
    todoDoc.lastOpenDate = new Date();
    await todoDoc.save();

    res.json({
      userName: todoDoc.userName,
      todos: todoDoc.todos,
      lastOpenDate: todoDoc.lastOpenDate,
    });
  } catch (error) {
    console.error("Error toggling todo:", error);
    res.status(500).json({ error: "Failed to toggle todo" });
  }
};
