import { useState, useEffect } from "react";

interface HeaderProps {
  userName?: string;
  showWelcome?: boolean;
}

export default function Header({ userName, showWelcome }: HeaderProps) {
  const [displayText, setDisplayText] = useState<string>("ToDo List");
  const [isWelcomeText, setIsWelcomeText] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);

  useEffect(() => {
    if (!showWelcome || !userName) {
      setDisplayText("ToDo List");
      setIsWelcomeText(false);
      return;
    }

    // Extract first name from full name
    const firstName = userName.trim().split(" ")[0];
    const welcomeText = `Welcome, ${firstName}`;

    setDisplayText(welcomeText);
    setIsWelcomeText(true);
    setAnimationKey((value) => value + 1);

    const transitionTimer = window.setTimeout(() => {
      setDisplayText("ToDo List");
      setIsWelcomeText(false);
      setAnimationKey((value) => value + 1);
    }, 1800);

    return () => {
      clearTimeout(transitionTimer);
    };
  }, [showWelcome, userName]);

  return (
    <header>
      <h1 className="header-title">
        <span
          key={animationKey}
          className={`header-text ${isWelcomeText ? "welcome-text" : ""}`}
        >
          {displayText}
        </span>
      </h1>
    </header>
  );
}
