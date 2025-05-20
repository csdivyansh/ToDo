import TodoCard from "./TodoCard";

export default function TodoList(props) {
  const { todos, handleDeleteTodos, handleEditTodos, handleToggleComplete } =
    props;

  return (
    <ul className="main">
      {todos.map((todo, index) => (
        <TodoCard
          key={index}
          index={index}
          todo={todo}
          handleDeleteTodo={handleDeleteTodos}
          handleEditTodo={handleEditTodos}
          handleToggleComplete={handleToggleComplete}
        />
      ))}
    </ul>
  );
}
