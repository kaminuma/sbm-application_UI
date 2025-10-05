import { apiClient } from "../api/interceptor";
import logger from "../utils/logger";

export const setAuthToken = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (refreshToken && !token) {
    logger.warn('Refresh token exists without access token. Possible inconsistent state.');
  }
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const saveAuthTokens = (token, refreshToken) => {
  if (!token || !refreshToken) {
    throw new Error('Both access and refresh tokens are required');
  }

  // セキュリティチェック
  if (!isSecureContext()) {
    logger.warn('Storing tokens in insecure context. Use HTTPS in production.');
  }

  // アクセストークン形式の検証
  if (!validateTokenFormat(token)) {
    throw new Error('Invalid access token format');
  }

  const currentRefreshToken = localStorage.getItem('refreshToken');
  const refreshTokenChanged = currentRefreshToken !== refreshToken;

  localStorage.setItem("token", token);

  // リフレッシュトークンは値が変わっていなくてもそのまま保持（30日固定仕様）
  if (refreshTokenChanged) {
    logger.debug('Updating refresh token stored locally');
    localStorage.setItem("refreshToken", refreshToken);
  } else if (!currentRefreshToken) {
    // 初回保存時は currentRefreshToken が null なので上書きする
    localStorage.setItem("refreshToken", refreshToken);
  }

  setAuthToken();
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const clearAuthTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  setAuthToken();
};

// セキュリティ関連のヘルパー関数
const isSecureContext = () => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

const validateTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  // JWT形式の基本的な検証（3つの部分がドットで区切られている）
  const parts = token.split('.');
  return parts.length === 3;
};

let refreshPromise = null; // 同時リフレッシュを防ぐ

export const refreshAccessToken = async () => {
  // 既にリフレッシュ中の場合は同じPromiseを返す
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!isSecureContext()) {
    logger.warn('Insecure context detected. HTTPS is recommended for production.');
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      // トークン形式の検証
      if (!validateTokenFormat(data.token)) {
        throw new Error('Invalid token format received');
      }

      const nextRefreshToken = data.refreshToken || refreshToken;
      if (!nextRefreshToken) {
        throw new Error('Missing refresh token in response');
      }

      saveAuthTokens(data.token, nextRefreshToken);
      return data.token;
    } catch (error) {
      clearAuthTokens();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// 下位互換性のために残す
export const saveAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    setAuthToken(); // トークンを保存したらすぐにheadersを更新
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  setAuthToken();
};

// 認証関連のストレージをすべてクリア（デバッグ用）
export const clearAllAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("vuex-auth");
  setAuthToken();
};
