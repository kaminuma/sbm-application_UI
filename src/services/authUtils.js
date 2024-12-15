import { apiClient } from "../api/interceptor";

export const setAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
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
