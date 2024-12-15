import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // 例: http://localhost:8080/api/v1

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
