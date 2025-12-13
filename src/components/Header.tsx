interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header>
      <h1>ToDos List</h1>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? "☀️" : "🌛"}
      </button>
    </header>
  );
}
