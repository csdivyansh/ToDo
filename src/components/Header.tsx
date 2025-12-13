import { useState, useEffect } from "react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  userName?: string;
  showWelcome?: boolean;
}

export default function Header({
  darkMode,
  toggleDarkMode,
  userName,
  showWelcome,
}: HeaderProps) {
  const [displayText, setDisplayText] = useState<string>("ToDos List");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (!showWelcome || !userName) return;

    const welcomeText = `Welcome ${userName}`;
    const finalText = "ToDos List";
    let currentIndex = 0;
    let isErasing = false;
    let currentText = "";
    setIsTyping(true);
    const typeWriter = setInterval(() => {
      if (!isErasing) {
        if (currentIndex < welcomeText.length) {
          currentText = welcomeText.substring(0, currentIndex + 1);
          setDisplayText(currentText);
          currentIndex++;
        } else {
          setTimeout(() => {
            isErasing = true;
            currentIndex = welcomeText.length;
          }, 1500);
        }
      } else {
        if (currentIndex > 0) {
          currentText = welcomeText.substring(0, currentIndex - 1);
          setDisplayText(currentText);
          currentIndex--;
        } else {
          clearInterval(typeWriter);
          setTimeout(() => {
            let finalIndex = 0;
            const typeFinal = setInterval(() => {
              if (finalIndex < finalText.length) {
                setDisplayText(finalText.substring(0, finalIndex + 1));
                finalIndex++;
              } else {
                clearInterval(typeFinal);
                setIsTyping(false);
              }
            }, 80);
          }, 300);
        }
      }
    }, 100);

    return () => clearInterval(typeWriter);
  }, [showWelcome, userName]);

  return (
    <header>
      <h1 className={isTyping ? "typing" : ""}>
        {displayText}
        {isTyping && <span className="cursor">|</span>}
      </h1>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? "☀️" : "🌛"}
      </button>
    </header>
  );
}
