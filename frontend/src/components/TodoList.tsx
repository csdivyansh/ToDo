import TodoCard from "./TodoCard";

interface Todo {
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  handleDeleteTodos: (index: number) => void;
  handleEditTodos: (index: number) => void;
  handleToggleComplete: (index: number) => void;
}

export default function TodoList({
  todos,
  handleDeleteTodos,
  handleEditTodos,
  handleToggleComplete,
}: TodoListProps) {
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
