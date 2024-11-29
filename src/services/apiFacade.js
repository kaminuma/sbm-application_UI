import axios from "axios";
import { saveAuthToken, setAuthToken } from "./authUtils";

// 環境変数からAPIのベースURLを設定
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// アプリ起動時にトークンを設定
setAuthToken();

const apiFacade = {
  // ユーザー登録のメソッド
  registerUser(username, email, password) {
    return axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      password,
      email,
    });
  },

  // ユーザーログインのメソッド
  loginUser(username, password) {
    return axios
      .post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          // 成功した場合、トークンを保存
          saveAuthToken(response.data.token);
          return response.data;
        } else {
          throw new Error("Login failed");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        throw error;
      });
  },

  // Excelファイルアップロード
  async uploadExcelFile(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      throw error;
    }
  },

  // ユーザーの活動データを取得
  async getActivities(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/activities`, {
        params: { userId },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch activities");
      }
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // 新しい活動データを作成
  async createActivity(activity) {
    try {
      const response = await axios.post(`${API_BASE_URL}/activities`, activity);
      return response.data;
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  },

  // 活動データを更新
  async updateActivity(activity) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/activities/${activity.activityId}`,
        activity
      );
      return response.data;
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  },

  // 活動データを削除
  async deleteActivity(activityId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/activities/${activityId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  },
};

export default apiFacade;
