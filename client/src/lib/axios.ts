import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8084",
});

// Injeta o token JWT (salvo como JSON pelo AuthContext) em toda requisição.
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("token");
  if (stored) {
    let token = stored;
    try {
      token = JSON.parse(stored);
    } catch {
      // token salvo sem aspas JSON — usa como está
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
