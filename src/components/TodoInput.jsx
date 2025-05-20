export default function TodoInput(props) {
  const { handleAddTodos, todoValue, setTodoValue } = props;
  return (
    <header>
      <input
        value={todoValue}
        onChange={(e) => setTodoValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            document.getElementById("add-btn").click();
          }
        }}
        placeholder="Enter todo..."
      />
      <button
        id="add-btn"
        onClick={() => {
          handleAddTodos(todoValue);
          setTodoValue("");
        }}
      >
        Add
      </button>
    </header>
  );
}
