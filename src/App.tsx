import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NameModal from "./components/NameModal";

interface Todo {
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoValue, setTodoValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem("userName");
    return saved || "";
  });
  const [showModal, setShowModal] = useState<boolean>(() => {
    const saved = localStorage.getItem("userName");
    return !saved;
  });
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    const saved = localStorage.getItem("userName");
    return !!saved; // Show welcome animation if username exists
  });
  // Dark mode is now always enabled
  const darkMode = true;

  const API_BASE_URL = `https://pingnotes.onrender.com/api/misc/todos/${userName}`;

  function persistData(newList: Todo[]): void {
    localStorage.setItem("todos", JSON.stringify({ todos: newList }));
  }

  // Fetch todos from backend
  async function fetchTodos(): Promise<void> {
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        if (data.todos && Array.isArray(data.todos) && data.todos.length > 0) {
          // Backend has todos, use them
          setTodos(data.todos);
          persistData(data.todos);
        } else {
          // Backend returned empty, add default todos
          const defaultTodos: Todo[] = [
            { text: "Welcome to csdiv's todos list app", completed: false },
            { text: "Start making your day productive", completed: false }
          ];
          setTodos(defaultTodos);
          persistData(defaultTodos);
        }
      } else {
        // Backend failed, fallback to localStorage
        loadLocalTodos();
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      // Fallback to localStorage if backend is unavailable
      loadLocalTodos();
    }
  }

  // Load todos from localStorage
  function loadLocalTodos(): void {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      const todosArray = JSON.parse(localTodos).todos;
      setTodos(todosArray);
    } else {
      // Set default todos if none exist
      const defaultTodos: Todo[] = [
        { text: "Welcome to csdiv's todos list app", completed: false },
        { text: "Start making your day productive", completed: false },
        { text: "CF", completed: false },
        { text: "LC", completed: false },
        { text: "HS", completed: false },
        { text: "CH", completed: false },
        { text: "BG", completed: false },
      ];
      setTodos(defaultTodos);
      persistData(defaultTodos);
    }
  }

  // Update all todos on backend
  async function updateTodosOnBackend(newList: Todo[]): Promise<void> {
    try {
      await fetch(API_BASE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos: newList }),
      });
    } catch (error) {
      console.error("Error updating todos:", error);
    }
  }

  useEffect(() => {
    // Fetch todos from backend on mount and refresh
    fetchTodos();

    const today = new Date().toDateString();
    const lastOpen = localStorage.getItem("lastOpenDate");
    localStorage.setItem("lastOpenDate", today);

    // Reset completed todos if it's a new day
    if (lastOpen && lastOpen !== today) {
      // This will be handled after todos are loaded
      setTimeout(() => {
        setTodos((prevTodos) => {
          if (prevTodos.length > 0) {
            const updatedTodos = prevTodos.map((todo) => ({
              ...todo,
              completed: false,
            }));
            persistData(updatedTodos);
            updateTodosOnBackend(updatedTodos);
            return updatedTodos;
          }
          return prevTodos;
        });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      if (darkMode) {
        root.classList.add("dark-mode");
      } else {
        root.classList.remove("dark-mode");
      }
    }
  }, [darkMode]);

  async function handleAddTodos(newTodo: string): Promise<void> {
    if (newTodo !== "") {
      if (isEditing && editingIndex !== -1) {
        // Update existing todo
        const newTodoList = [...todos];
        newTodoList[editingIndex] = {
          ...newTodoList[editingIndex],
          text: newTodo,
        };
        persistData(newTodoList);
        setTodos(newTodoList);
        await updateTodosOnBackend(newTodoList);
        setIsEditing(false);
        setEditingIndex(-1);
      } else {
        // Add new todo
        const newTodoItem: Todo = { text: newTodo, completed: false };
        try {
          const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodoItem),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.todos) {
              setTodos(data.todos);
              persistData(data.todos);
            }
          }
        } catch (error) {
          console.error("Error adding todo:", error);
          // Fallback to local update if backend fails
          const newTodoList: Todo[] = [...todos, newTodoItem];
          persistData(newTodoList);
          setTodos(newTodoList);
        }
        setIsEditing(false);
      }
    }
  }

  async function handleToggleComplete(index: number): Promise<void> {
    const newTodoList = [...todos];
    newTodoList[index].completed = !newTodoList[index].completed;
    persistData(newTodoList);
    setTodos(newTodoList);

    try {
      await fetch(`${API_BASE_URL}/${index}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  }

  async function handleDeleteTodos(index: number): Promise<void> {
    const newTodoList = todos.filter((_todo, todoIndex) => {
      return todoIndex !== index;
    });
    persistData(newTodoList);
    setTodos(newTodoList);

    try {
      await fetch(`${API_BASE_URL}/${index}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  function handleEditTodos(index: number): void {
    const valueToBeEdited = todos[index].text;
    setTodoValue(valueToBeEdited);
    setIsEditing(true);
    setEditingIndex(index);
  }

  function handleNameSubmit(name: string): void {
    setUserName(name);
    localStorage.setItem("userName", name);
    setShowModal(false);
    setShowWelcome(true);
  }

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      {showModal && <NameModal onSubmit={handleNameSubmit} />}
      <Header userName={userName} showWelcome={showWelcome} />

      <TodoInput
        todoValue={todoValue}
        setTodoValue={setTodoValue}
        handleAddTodos={handleAddTodos}
        isEditing={isEditing}
      />
      <TodoList
        handleDeleteTodos={handleDeleteTodos}
        handleEditTodos={handleEditTodos}
        handleToggleComplete={handleToggleComplete}
        todos={todos}
      />
      <Footer />
    </div>
  );
}

export default App;
