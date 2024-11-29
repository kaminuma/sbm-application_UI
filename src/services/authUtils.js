import axios from "axios";

// トークンをAxiosのヘッダーに設定する関数
export const setAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"]; // トークンがない場合はヘッダーを削除
  }
};

// トークンをローカルストレージに保存する関数
export const saveAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    setAuthToken(); // ヘッダーを更新
  }
};

// トークンを削除する関数
export const clearAuthToken = () => {
  localStorage.removeItem("token");
  setAuthToken(); // ヘッダーを削除
};
