import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_VIDUCATE_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
