import axios from "axios";
import { refreshAccessToken } from "../services/authUtils";
import logger from "../utils/logger";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // 例: http://localhost:8080/api/v1

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// リクエストインターセプター：すべてのリクエスト前に実行される
apiClient.interceptors.request.use(
  (config) => {
    // JWTトークンを自動付与
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // リクエスト情報をログに出力（機密情報は除外）
    logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params
    });
    return config;
  },
  (error) => {
    logger.error('API request error:', error.message);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター：すべてのレスポンス後に実行される
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // 401エラー（認証失敗）の場合
      if (error.response.status === 401 && !originalRequest._retry) {
        // ログインエンドポイントへのリクエストの場合は、リフレッシュを試行しない
        const isLoginRequest = originalRequest?.url?.includes('/auth/login');
        const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

        if (!isLoginRequest && !isRefreshRequest) {
          originalRequest._retry = true;

          try {
            await refreshAccessToken();
            return apiClient(originalRequest);
          } catch (refreshError) {
            // リフレッシュ失敗時はログインページへリダイレクト
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        }
      }
    } else if (error.request) {
      logger.error('Network error or no response');
    } else {
      logger.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);
