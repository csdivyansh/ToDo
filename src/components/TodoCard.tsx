interface Todo {
  text: string;
  completed: boolean;
}

interface TodoCardProps {
  todo: Todo;
  index: number;
  handleDeleteTodo: (index: number) => void;
  handleEditTodo: (index: number) => void;
  handleToggleComplete: (index: number) => void;
}

export default function TodoCard({
  todo,
  index,
  handleDeleteTodo,
  handleEditTodo,
  handleToggleComplete,
}: TodoCardProps) {
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
