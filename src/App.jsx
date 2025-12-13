import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [todos, setTodos] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", JSON.stringify(!prev));
      return !prev;
    });
  };
  function persistData(newList) {
    localStorage.setItem("todos", JSON.stringify({ todos: newList }));
  }
  useEffect(() => {
    const today = new Date().toDateString();
    const lastOpen = localStorage.getItem("lastOpenDate");
    let localTodos = localStorage.getItem("todos");
    let todosArray = [];

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
      const defaultTodos = [
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
    if (darkMode) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
  }, [darkMode]);

  function handleAddTodos(newTodo) {
    if (newTodo !== "") {
      const newTodoList = [...todos, { text: newTodo, completed: false }];
      persistData(newTodoList);
      setTodos(newTodoList);
      setIsEditing(false);
    }
  }

  function handleToggleComplete(index) {
    const newTodoList = [...todos];
    newTodoList[index].completed = !newTodoList[index].completed;
    persistData(newTodoList);
    setTodos(newTodoList);
  }

  function handleDeleteTodos(index) {
    const newTodoList = todos.filter((todo, todoIndex) => {
      return todoIndex !== index;
    });
    persistData(newTodoList);

    setTodos(newTodoList);
  }

  function handleEditTodos(index) {
    const valueToBeEdited = todos[index].text;
    setTodoValue(valueToBeEdited);
    handleDeleteTodos(index);
    setIsEditing(true);
  }

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

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
