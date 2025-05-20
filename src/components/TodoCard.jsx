export default function TodoCard({
  todo,
  index,
  handleDeleteTodo,
  handleEditTodo,
  handleToggleComplete,
}) {
  return (
    <li className="todoItem">
      <p style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
        {todo.text}
      </p>
      <div className="actionsContainer">
        <button onClick={() => handleToggleComplete(index)}>
          <i className="fa-solid fa-check"></i>
        </button>
        <button onClick={() => handleEditTodo(index)}>
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button onClick={() => handleDeleteTodo(index)}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </li>
  );
}
