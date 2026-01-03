import { useEffect, useState } from "react";
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
  loading?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

export default function TodoList({
  todos,
  handleDeleteTodos,
  handleEditTodos,
  handleToggleComplete,
  loading = false,
}: TodoListProps) {
  const [showFireworks, setShowFireworks] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const allCompleted =
      todos.length > 0 && todos.every((todo) => todo.completed);

    if (allCompleted && !showFireworks) {
      setShowFireworks(true);
      createFireworks();

      // Reset after animation
      setTimeout(() => {
        setShowFireworks(false);
        setParticles([]);
      }, 3000);
    } else if (!allCompleted && showFireworks) {
      setShowFireworks(false);
      setParticles([]);
    }
  }, [todos]);

  const createFireworks = () => {
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ffa500",
    ];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100;
      const velocity = 2 + Math.random() * 3;
      newParticles.push({
        x: 50,
        y: 50,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }

    setParticles(newParticles);
    animateParticles(newParticles);
  };

  const animateParticles = (initialParticles: Particle[]) => {
    let frame = 0;
    const maxFrames = 60;

    const animate = () => {
      if (frame >= maxFrames) return;

      setParticles((prevParticles) =>
        prevParticles.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1, // gravity
          life: p.life - 1 / maxFrames,
        }))
      );

      frame++;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };
  if (loading) {
    return (
      <div className="main" style={{ textAlign: "center", padding: "2rem" }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {showFireworks && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {particles.map((particle, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: particle.color,
                opacity: particle.life,
                boxShadow: `0 0 10px ${particle.color}`,
                transition: "all 0.016s linear",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#ffd700",
              textShadow: "0 0 20px #ffd700, 0 0 40px #ff6b6b",
              animation: "celebrate 0.5s ease-in-out",
            }}
          >
            🎉 All Done! 🎉
          </div>
        </div>
      )}
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
    </div>
  );
}
