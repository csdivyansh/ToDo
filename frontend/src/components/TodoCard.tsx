interface Todo {
  text: string;
  completed: boolean;
}

interface TodoCardProps {
  todo: Todo;
  index: number;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: () => void;
  onDragOver?: (event: React.DragEvent<HTMLLIElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd?: () => void;
  handleDeleteTodo: (index: number) => void;
  handleEditTodo: (index: number) => void;
  handleToggleComplete: (index: number) => void;
}

export default function TodoCard({
  todo,
  index,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  handleDeleteTodo,
  handleEditTodo,
  handleToggleComplete,
}: TodoCardProps) {
  return (
    <li
      className={`todoItem${isDragging ? " dragging" : ""}${isDragOver ? " drag-over" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <button
        className={`checkboxButton${todo.completed ? " checked" : ""}`}
        onClick={() => handleToggleComplete(index)}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <span aria-hidden="true">{todo.completed ? "✓" : ""}</span>
      </button>
      <p style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
        {todo.text}
      </p>
      <div className="actionsContainer">
        <button className="pencilButton" onClick={() => handleEditTodo(index)}>
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button onClick={() => handleDeleteTodo(index)}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </li>
  );
}
