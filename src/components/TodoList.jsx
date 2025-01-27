import React from "react";
import TodoCard from "./TodoCard";

export default function TodoList(props) {
  const { todos, handleDeleteTodos, handleEditTodos } = props;

  return (
    <ul className="main">
      {todos.map((todo, todoIndex) => (
        <TodoCard
          key={todoIndex}
          index={todoIndex}
          handleDeleteTodo={handleDeleteTodos}
          handleEditTodo={handleEditTodos}
        >
          <p>{todo}</p>
        </TodoCard>
      ))}
    </ul>
  );
}
