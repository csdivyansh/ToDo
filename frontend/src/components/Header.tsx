import { useState, useEffect } from "react";

interface HeaderProps {
  userName?: string;
  showWelcome?: boolean;
}

export default function Header({ userName, showWelcome }: HeaderProps) {
  const [displayText, setDisplayText] = useState<string>("ToDos List");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (!showWelcome || !userName) return;

    // Extract first name from full name
    const firstName = userName.trim().split(" ")[0];
    const welcomeText = `Welcome ${firstName}`;
    const finalText = "ToDo List";
    let timers: number[] = [];
    let isCancelled = false;

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        if (!isCancelled) fn();
      }, delay);
      timers.push(id);
    };

    const typeText = (text: string, speed = 60, onDone?: () => void) => {
      setIsTyping(true);
      let i = 0;
      const step = () => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i));
          i++;
          schedule(step, speed);
        } else if (onDone) {
          onDone();
        }
      };
      step();
    };

    const eraseText = (text: string, speed = 50, onDone?: () => void) => {
      let i = text.length;
      const step = () => {
        if (i >= 0) {
          setDisplayText(text.slice(0, i));
          i--;
          schedule(step, speed);
        } else if (onDone) {
          onDone();
        }
      };
      step();
    };

    const runCycle = () => {
      // Type welcome
      typeText(welcomeText, 50, () => {
        // Pause, then erase welcome
        schedule(() => {
          eraseText(welcomeText, 40, () => {
            // Small pause, then type final title
            schedule(() => {
              typeText(finalText, 70, () => {
                // Pause on final text, then loop again after 5s
                schedule(() => {
                  setIsTyping(false);
                  runCycle();
                }, 5000);
              });
            }, 200);
          });
        }, 900);
      });
    };

    runCycle();

    return () => {
      isCancelled = true;
      timers.forEach((id) => clearTimeout(id));
    };
  }, [showWelcome, userName]);

  return (
    <header>
      <h1 className={isTyping ? "typing" : ""}>
        <span
          style={{
            color: displayText.startsWith("Welcome") ? "aqua" : "inherit",
          }}
        >
          {displayText}
        </span>
        {isTyping && <span className="cursor">|</span>}
      </h1>
    </header>
  );
}
