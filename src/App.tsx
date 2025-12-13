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
    if (!userName) return; // Don't fetch if no username

    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        if (data.todos && Array.isArray(data.todos) && data.todos.length > 0) {
          setTodos(data.todos);
          persistData(data.todos);
        } else {
          // Backend returned empty, check localStorage first
          const localTodos = localStorage.getItem("todos");
          if (localTodos) {
            const todosArray = JSON.parse(localTodos).todos;
            setTodos(todosArray);
            // Sync local todos to backend with new username
            updateTodosOnBackend(todosArray);
          } else {
            // No local todos either, add default todos
            const defaultTodos: Todo[] = [
              { text: "Welcome to csdiv's todos list app", completed: false },
              { text: "Start making your day productive", completed: false },
            ];
            setTodos(defaultTodos);
            persistData(defaultTodos);
            updateTodosOnBackend(defaultTodos);
          }
        }
      } else {
        // Backend failed, fallback to localStorage
        loadLocalTodos();
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      loadLocalTodos();
    }
  }

  function loadLocalTodos(): void {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      const todosArray = JSON.parse(localTodos).todos;
      setTodos(todosArray);
    } else {
      const defaultTodos: Todo[] = [
        { text: "Welcome to csdiv's todos list app", completed: false },
        { text: "Start making your day productive", completed: false },
      ];
      setTodos(defaultTodos);
      persistData(defaultTodos);
    }
  }

  // Update all todos on backend
  async function updateTodosOnBackend(newList: Todo[]): Promise<void> {
    if (!userName) return; // Don't update if no username

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
    const loadTodos = async () => {
      if (userName) {
        // Only fetch todos if username exists
        await fetchTodos();
      } else {
        // Load from localStorage if no username yet
        loadLocalTodos();
      }

      // Handle daily reset after todos are loaded
      const today = new Date().toDateString();
      const lastOpen = localStorage.getItem("lastOpenDate");

      if (lastOpen && lastOpen !== today) {
        setTodos((prevTodos) => {
          if (prevTodos.length > 0) {
            const updatedTodos = prevTodos.map((todo) => ({
              ...todo,
              completed: false,
            }));
            persistData(updatedTodos);
            if (userName) {
              updateTodosOnBackend(updatedTodos);
            }
            return updatedTodos;
          }
          return prevTodos;
        });
      }

      localStorage.setItem("lastOpenDate", today);
    };

    loadTodos();
  }, [userName]); // Re-run when userName changes

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
        // Update existing todo - optimistic update
        const newTodoList = [...todos];
        newTodoList[editingIndex] = {
          ...newTodoList[editingIndex],
          text: newTodo,
        };
        persistData(newTodoList);
        setTodos(newTodoList);
        setIsEditing(false);
        setEditingIndex(-1);

        // Sync with backend asynchronously (non-blocking)
        if (userName) {
          updateTodosOnBackend(newTodoList);
        }
      } else {
        // Add new todo - optimistic update
        const newTodoItem: Todo = { text: newTodo, completed: false };
        const newTodoList: Todo[] = [...todos, newTodoItem];

        // Update locally first (instant UI response)
        persistData(newTodoList);
        setTodos(newTodoList);
        setIsEditing(false);

        // Sync with backend asynchronously (non-blocking)
        if (userName) {
          fetch(API_BASE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodoItem),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error("Failed to sync with backend");
            })
            .then((data) => {
              // Optionally update with backend response if it differs
              if (
                data.todos &&
                JSON.stringify(data.todos) !== JSON.stringify(newTodoList)
              ) {
                setTodos(data.todos);
                persistData(data.todos);
              }
            })
            .catch((error) => {
              console.error("Error syncing todo with backend:", error);
              // Local update already done, so user isn't affected
            });
        }
      }
    }
  }

  async function handleToggleComplete(index: number): Promise<void> {
    // Optimistic update - toggle locally first
    const newTodoList = [...todos];
    newTodoList[index].completed = !newTodoList[index].completed;
    persistData(newTodoList);
    setTodos(newTodoList);

    // Sync with backend asynchronously (non-blocking)
    if (userName) {
      fetch(`${API_BASE_URL}/${index}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Error syncing toggle with backend:", error);
        // Local update already done, so user isn't affected
      });
    }
  }

  async function handleDeleteTodos(index: number): Promise<void> {
    // Optimistic update - delete locally first
    const newTodoList = todos.filter((_todo, todoIndex) => {
      return todoIndex !== index;
    });
    persistData(newTodoList);
    setTodos(newTodoList);

    // Sync with backend asynchronously (non-blocking)
    if (userName) {
      fetch(`${API_BASE_URL}/${index}`, {
        method: "DELETE",
      }).catch((error) => {
        console.error("Error syncing deletion with backend:", error);
        // Local update already done, so user isn't affected
      });
    }
  }

  function handleEditTodos(index: number): void {
    const valueToBeEdited = todos[index].text;
    setTodoValue(valueToBeEdited);
    setIsEditing(true);
    setEditingIndex(index);
  }

  function handleNameSubmit(name: string, password: string): void {
    setUserName(name);
    localStorage.setItem("userName", name);
    localStorage.setItem("userPassword", password);
    setShowModal(false);
    setShowWelcome(true);

    // Sync existing todos to backend with new username
    if (todos.length > 0) {
      const API_URL = `https://pingnotes.onrender.com/api/misc/todos/${name}`;
      fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos }),
      }).catch((error) => console.error("Error syncing todos:", error));
    }
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
