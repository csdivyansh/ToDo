import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";

interface AuthModalProps {
  onAuthSuccess: (userName: string, name: string, token: string) => void;
}

type AuthMode = "login" | "signup";

function AuthModal({ onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [userName, setUserName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkUsernameAvailability = async (username: string) => {
    if (!username.trim() || username.length < 3) {
      setError("");
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      const response = await fetch(
        API_ENDPOINTS.checkUsername(username.trim()),
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.available) {
        setIsAvailable(true);
        setError("");
      } else {
        setIsAvailable(false);
        setError(data.message || "Username is already taken");
      }
    } catch (err) {
      console.error("Error checking username:", err);
      setError("Unable to check username availability");
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUserName = e.target.value;
    setUserName(newUserName);

    // Reset states when user is typing
    if (newUserName.length < 3) {
      setError("");
      setIsAvailable(null);
    }
  };

  const handleBlur = () => {
    if (mode === "signup" && userName.trim().length >= 3) {
      checkUsernameAvailability(userName.trim());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUserName = userName.trim();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();

    // Validation
    if (!trimmedUserName) {
      setError("Username is required");
      return;
    }

    if (trimmedUserName.length < 3 || trimmedUserName.length > 20) {
      setError("Username must be between 3 and 20 characters");
      return;
    }

    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernameRegex.test(trimmedUserName)) {
      setError(
        "Username can only contain letters, numbers, underscore, and hyphen"
      );
      return;
    }

    if (mode === "signup") {
      if (!trimmedName) {
        setError("Name is required");
        return;
      }

      if (trimmedName.length < 2 || trimmedName.length > 50) {
        setError("Name must be between 2 and 50 characters");
        return;
      }

      if (isAvailable === false) {
        setError("This username is already taken");
        return;
      }
    }

    if (!trimmedPassword) {
      setError("Password is required");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        mode === "signup" ? API_ENDPOINTS.signup() : API_ENDPOINTS.login();

      const body =
        mode === "signup"
          ? {
              userName: trimmedUserName,
              name: trimmedName,
              password: trimmedPassword,
            }
          : { userName: trimmedUserName, password: trimmedPassword };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        onAuthSuccess(
          data.data.user.userName,
          data.data.user.name,
          data.data.token
        );
      } else {
        setError(
          data.message || `${mode === "signup" ? "Signup" : "Login"} failed`
        );
      }
    } catch (err) {
      console.error(`${mode} error:`, err);
      setError(
        `An error occurred during ${mode === "signup" ? "signup" : "login"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setIsAvailable(null);
    setUserName("");
    setName("");
    setPassword("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === "signup" ? "Create Account" : "Welcome Back!"}</h2>
        <p>
          {mode === "signup"
            ? "Sign up to start organizing your tasks"
            : "Login to access your todos"}
        </p>
        <form onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                flexWrap: "nowrap",
              }}
            >
              <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  name="username"
                  value={userName}
                  onChange={handleUserNameChange}
                  onBlur={handleBlur}
                  placeholder="Username"
                  autoFocus
                  maxLength={20}
                  disabled={isLoading}
                  autoComplete={mode === "signup" ? "off" : "username"}
                  style={{
                    borderColor:
                      mode === "signup" && isAvailable === true
                        ? "#4caf50"
                        : mode === "signup" && isAvailable === false
                        ? "#f44336"
                        : "",
                    paddingRight:
                      mode === "signup" && (isChecking || isAvailable !== null)
                        ? "40px"
                        : "",
                    width: "100%",
                  }}
                />
                {mode === "signup" && isChecking && (
                  <span
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                      color: "#999",
                      pointerEvents: "none",
                    }}
                  >
                    Checking...
                  </span>
                )}
                {mode === "signup" && !isChecking && isAvailable === true && (
                  <span
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "20px",
                      color: "#4caf50",
                      fontWeight: "bold",
                      pointerEvents: "none",
                    }}
                  >
                    ✓
                  </span>
                )}
                {mode === "signup" && !isChecking && isAvailable === false && (
                  <span
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "20px",
                      color: "#f44336",
                      fontWeight: "bold",
                      pointerEvents: "none",
                    }}
                  >
                    ✗
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => checkUsernameAvailability(userName.trim())}
                disabled={isLoading || isChecking || userName.trim().length < 3}
                style={{
                  borderRadius: "14px",
                  background: "#2d2d2d",
                  color: "#e8d9c9",
                  padding: "14px 18px",
                  border: "1px solid #444",
                  outline: "none",
                  fontSize: "1.1rem",
                  cursor:
                    userName.trim().length >= 3 && !isLoading && !isChecking
                      ? "pointer"
                      : "not-allowed",
                  transition: "background 200ms",
                  opacity:
                    userName.trim().length >= 3 && !isLoading && !isChecking
                      ? 1
                      : 0.5,
                  minWidth: "fit-content",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (
                    userName.trim().length >= 3 &&
                    !isLoading &&
                    !isChecking
                  ) {
                    e.currentTarget.style.background = "#3d3d3d";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#2d2d2d";
                }}
              >
                Check
              </button>
            </div>
          ) : (
            <input
              type="text"
              name="username"
              value={userName}
              onChange={handleUserNameChange}
              placeholder="Username"
              autoFocus
              maxLength={20}
              disabled={isLoading}
              autoComplete="username"
            />
          )}

          {mode === "signup" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              maxLength={50}
              disabled={isLoading}
              autoComplete="off"
            />
          )}

          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
          />

          {error && (
            <div
              style={{
                color: "#f44336",
                fontSize: "14px",
                marginTop: "8px",
                marginBottom: "8px",
              }}
            >
              {error}
            </div>
          )}

          {mode === "signup" && !error && isAvailable === true && (
            <div
              style={{
                color: "#4caf50",
                fontSize: "14px",
                marginTop: "8px",
                marginBottom: "8px",
              }}
            >
              Username is available!
            </div>
          )}

          {mode === "signup" && (
            <div
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "8px",
                marginBottom: "12px",
              }}
            >
              Username: 3-20 characters, letters, numbers, underscore, hyphen
              only
              <br />
              Password: At least 6 characters
            </div>
          )}

          <button
            type="submit"
            disabled={
              isLoading ||
              !userName.trim() ||
              userName.trim().length < 3 ||
              !password.trim() ||
              password.trim().length < 6 ||
              (mode === "signup" && !name.trim()) ||
              (mode === "signup" && (isChecking || isAvailable === false))
            }
          >
            {isLoading
              ? mode === "signup"
                ? "Creating Account..."
                : "Logging in..."
              : mode === "signup"
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
          }}
        >
          {mode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={switchMode}
            disabled={isLoading}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              font: "inherit",
            }}
          >
            {mode === "signup" ? "Login" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
