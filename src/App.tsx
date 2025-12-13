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

  function persistData(newList: Todo[]): void {
    localStorage.setItem("todos", JSON.stringify({ todos: newList }));
  }

  useEffect(() => {
    const today = new Date().toDateString();
    const lastOpen = localStorage.getItem("lastOpenDate");
    let localTodos = localStorage.getItem("todos");
    let todosArray: Todo[] = [];

    if (localTodos) {
      todosArray = JSON.parse(localTodos).todos;
      if (lastOpen && lastOpen !== today) {
        todosArray = todosArray.map((todo) => ({
          ...todo,
          completed: false,
        }));
        persistData(todosArray);
      }
      setTodos(todosArray);
    } else {
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

    localStorage.setItem("lastOpenDate", today);
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

  function handleAddTodos(newTodo: string): void {
    if (newTodo !== "") {
      const newTodoList: Todo[] = [
        ...todos,
        { text: newTodo, completed: false },
      ];
      persistData(newTodoList);
      setTodos(newTodoList);
      setIsEditing(false);
    }
  }

  function handleToggleComplete(index: number): void {
    const newTodoList = [...todos];
    newTodoList[index].completed = !newTodoList[index].completed;
    persistData(newTodoList);
    setTodos(newTodoList);
  }

  function handleDeleteTodos(index: number): void {
    const newTodoList = todos.filter((_todo, todoIndex) => {
      return todoIndex !== index;
    });
    persistData(newTodoList);
    setTodos(newTodoList);
  }

  function handleEditTodos(index: number): void {
    const valueToBeEdited = todos[index].text;
    setTodoValue(valueToBeEdited);
    handleDeleteTodos(index);
    setIsEditing(true);
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
