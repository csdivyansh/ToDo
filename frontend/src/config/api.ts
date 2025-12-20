// API Configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// For Vercel deployment, use relative path in production
export const API_BASE_URL = isDevelopment
  ? "http://localhost:5000/api"
  : isProduction && typeof window !== "undefined"
  ? `${window.location.origin}/api`
  : "https://pingnotes.onrender.com/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  signup: () => `${API_BASE_URL}/auth/signup`,
  login: () => `${API_BASE_URL}/auth/login`,
  verifyToken: () => `${API_BASE_URL}/auth/verify`,

  // User endpoints
  checkUsername: (username: string) =>
    `${API_BASE_URL}/check-username/${username}`,

  // Todo endpoints
  todos: (username: string) => `${API_BASE_URL}/todos/${username}`,
  addTodo: (username: string) => `${API_BASE_URL}/todos/${username}`,
  deleteTodo: (username: string, index: number) =>
    `${API_BASE_URL}/todos/${username}/${index}`,
  toggleTodo: (username: string, index: number) =>
    `${API_BASE_URL}/todos/${username}/${index}`,
};
