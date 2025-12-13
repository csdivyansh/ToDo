import { useState } from "react";

interface NameModalProps {
  onSubmit: (name: string, password: string) => void;
}

function NameModal({ onSubmit }: NameModalProps) {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      const firstName = name.trim().split(" ")[0];
      onSubmit(firstName, password.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome!</h2>
        <p>Please enter your name and password to get started</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="submit" disabled={!name.trim() || !password.trim()}>
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}

export default NameModal;
