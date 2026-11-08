import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "X-CSRF-Protection": "1",
  },
});

export default api;