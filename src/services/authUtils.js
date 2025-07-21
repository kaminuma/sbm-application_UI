import { apiClient } from "../api/interceptor";

export const setAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log('Auth token set successfully');
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
    console.log('No auth token found, headers cleared');
  }
};

export const saveAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    setAuthToken(); // トークンを保存したらすぐにheadersを更新
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem("token");
  setAuthToken();
};

// 認証関連のストレージをすべてクリア（デバッグ用）
export const clearAllAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("vuex-auth");
  console.log("Cleared all auth data from localStorage");
  setAuthToken();
};
