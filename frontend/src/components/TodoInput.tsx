interface TodoInputProps {
  todoValue: string;
  setTodoValue: (value: string) => void;
  handleAddTodos: (todo: string) => void;
  isEditing: boolean;
}

export default function TodoInput({
  handleAddTodos,
  todoValue,
  setTodoValue,
  isEditing,
}: TodoInputProps) {
  return (
    <div className="input-container">
      <input
        value={todoValue}
        onChange={(e) => setTodoValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            document.getElementById("add-btn")?.click();
          }
        }}
        placeholder="Type your tasks here..."
        autoComplete="on"
      />
      <button
        id="add-btn"
        onClick={() => {
          handleAddTodos(todoValue);
          setTodoValue("");
        }}
      >
        {isEditing ? "Update" : "Add"}
      </button>
    </div>
  );
}
