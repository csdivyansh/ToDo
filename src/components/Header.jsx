export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header>
      <h1>ToDos List</h1>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  );
}
