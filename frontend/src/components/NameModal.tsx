import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";

interface NameModalProps {
  onSubmit: (name: string) => void;
}

function NameModal({ onSubmit }: NameModalProps) {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
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
        API_ENDPOINTS.checkUsername(username.trim())
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    // Reset states when user is typing
    if (newName.length < 3) {
      setError("");
      setIsAvailable(null);
    }
  };

  const handleBlur = () => {
    if (name.trim().length >= 3) {
      checkUsernameAvailability(name.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    // Validation
    if (!trimmedName) {
      setError("Username is required");
      return;
    }

    if (trimmedName.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (trimmedName.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }

    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernameRegex.test(trimmedName)) {
      setError(
        "Username can only contain letters, numbers, underscore, and hyphen"
      );
      return;
    }

    if (isAvailable === false) {
      setError("This username is already taken");
      return;
    }

    if (isAvailable === true) {
      onSubmit(trimmedName);
    } else {
      // Check one more time before submitting
      checkUsernameAvailability(trimmedName).then(() => {
        if (isAvailable === true) {
          onSubmit(trimmedName);
        }
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome!</h2>
        <p>Please choose a username to get started</p>
        <form onSubmit={handleSubmit}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={handleBlur}
              placeholder="Enter your username"
              autoFocus
              maxLength={20}
              style={{
                borderColor:
                  isAvailable === true
                    ? "#4caf50"
                    : isAvailable === false
                    ? "#f44336"
                    : "",
              }}
            />
            {isChecking && (
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                Checking...
              </span>
            )}
            {!isChecking && isAvailable === true && (
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px",
                  color: "#4caf50",
                }}
              >
                ✓
              </span>
            )}
            {!isChecking && isAvailable === false && (
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px",
                  color: "#f44336",
                }}
              >
                ✗
              </span>
            )}
          </div>
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
          {!error && isAvailable === true && (
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
          <div
            style={{
              fontSize: "12px",
              color: "#999",
              marginTop: "8px",
              marginBottom: "12px",
            }}
          >
            3-20 characters, letters, numbers, underscore, and hyphen only
          </div>
          <button
            type="submit"
            disabled={
              !name.trim() ||
              name.trim().length < 3 ||
              isChecking ||
              isAvailable === false
            }
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}

export default NameModal;
