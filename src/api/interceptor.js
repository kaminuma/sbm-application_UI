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
    // JWTトークンを自動付与
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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

// レスポンスインターセプター：すべてのレスポンス後に実行される
apiClient.interceptors.response.use(
  (response) => {
    // 成功時のレスポンス情報をログに出力
    console.log(`[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data
    });
    return response;
  },
  (error) => {
    // エラー時の処理
    if (error.response) {
      console.error(`[API Error] ${error.response.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        data: error.response.data,
        headers: error.response.headers
      });
      
      // 401エラー（認証失敗）の場合はトークンを削除してログインページへ
      if (error.response.status === 401) {
        console.log('[Auth] Token invalid, clearing authentication and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // ページ全体をリロードしてVuexストアもリセット
        window.location.href = '/';
        return;
      }
    } else if (error.request) {
      console.error('[API Error] Network error or no response:', error.request);
    } else {
      console.error('[API Error] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);
