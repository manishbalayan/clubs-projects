import axios from "axios";
VITE_API_URL="http://localhost:8080/api"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  withCredentials: true,
});

export default api;
