import axios from "axios";

// スマホアプリ専用の環境変数を優先的に使用
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_FROM_MOBILE || import.meta.env.VITE_API_BASE_URL;

console.log('API Client initialized with base URL:', API_BASE_URL);
console.log('Environment variables:', {
  VITE_API_BASE_URL_FROM_MOBILE: import.meta.env.VITE_API_BASE_URL_FROM_MOBILE,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  PROD: import.meta.env.PROD
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// リクエストインターセプターを追加
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);
