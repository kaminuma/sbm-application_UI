import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // 例: http://localhost:8080/api/v1

console.log('API Client initialized with base URL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// リクエストインターセプター：すべてのリクエスト前に実行される
apiClient.interceptors.request.use(
  (config) => {
    // リクエストの詳細情報をログに出力
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      params: config.params,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('APIリクエスト送信前のエラー:', error);
    return Promise.reject(error);
  }
);
