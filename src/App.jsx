import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  const [todos, setTodos] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
      setTodos(todosArray);
    }
    if (lastOpen) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastOpen === yesterday.toDateString()) {
        const newTodoList = todosArray.map((todo) => ({
          ...todo,
          completed: false,
        }));
        persistData(newTodoList);
        setTodos(newTodoList);
      }
    }

    localStorage.setItem("lastOpenDate", today);
  }, []);
  
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

  useEffect(() => {
    if (!localStorage) {
      return;
    }
    let localTodos = localStorage.getItem("todos");
    if (!localTodos) {
      return;
    }

    localTodos = JSON.parse(localTodos).todos;
    setTodos(localTodos);
  }, []);
  return (
    <>
      <Header />

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
    </>
  );
}

export default App;
