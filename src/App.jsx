import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  const [todos, setTodos] = useState([]);
  const [todoValue, setTodoValue] = useState('');
  
  function persistData(newList) {
    localStorage.setItem('todos', JSON.stringify({todos: newList}))
  }

  function handleAddTodos(newTodo) {
    if (newTodo !== "") {
      const newTodoList = [...todos, { text: newTodo, completed: false }];
      persistData(newTodoList);
      setTodos(newTodoList);
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
      return todoIndex !== index
    })
    persistData(newTodoList)

    setTodos(newTodoList);
  }

  function handleEditTodos(index) {
    const valueToBeEdited = todos[index]
    setTodoValue(valueToBeEdited)
    handleDeleteTodos(index)
  }

  useEffect(() => {
    if(!localStorage) {
      return
    }
    let localTodos = localStorage.getItem('todos');
    if (!localTodos){
      return;
    }

    localTodos = JSON.parse(localTodos).todos
    setTodos(localTodos) 
  }, [])
  return (
    <>
      <Header />

      <TodoInput
        todoValue={todoValue}
        setTodoValue={setTodoValue}
        handleAddTodos={handleAddTodos}
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
