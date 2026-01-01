/// <reference types="vite/client" />

// API base URL can be overridden at build time via VITE_API_BASE_URL
const isDevelopment = import.meta.env.DEV;
const envApiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Prefer explicit env override, otherwise default to dev/prod sensible values
export const API_BASE_URL = envApiBase
  ? envApiBase.replace(/\/$/, "") // trim trailing slash
  : isDevelopment
  ? "http://localhost:5000/api"
  : "/api";

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
