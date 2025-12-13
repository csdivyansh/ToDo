import { useState } from "react";

interface NameModalProps {
  onSubmit: (name: string) => void;
}

function NameModal({ onSubmit }: NameModalProps) {
  const [name, setName] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const firstName = name.trim().split(" ")[0];
      onSubmit(firstName);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome!</h2>
        <p>Please enter your name to get started</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
          />
          <button type="submit" disabled={!name.trim()}>
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}

export default NameModal;
