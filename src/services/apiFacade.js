import { apiClient } from "../api/interceptor";
import { saveAuthToken, setAuthToken } from "./authUtils";
import router from "../router"; // プロジェクト構成に合わせて調整

// 403ステータス返却時のレスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.error("トークンの有効期限が切れています。リダイレクトします。");
      alert(
        "トークンの有効期限がきれています。再度ログインしなおしてください。"
      );
      router.push("/"); // ログインページへ遷移
    }
    return Promise.reject(error);
  }
);

// アプリ起動時にトークンを設定
setAuthToken();

const apiFacade = {
  registerUser(username, email, password) {
    return apiClient.post("/auth/register", { username, password, email });
  },

  loginUser(username, password) {
    return apiClient
      .post("/auth/login", { username, password })
      .then((response) => {
        if (response.status === 200) {
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

  async uploadExcelFile(formData) {
    const response = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getActivities(userId) {
    const response = await apiClient.get("/activities", { params: { userId } });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch activities");
    }
  },

  async createActivity(activity) {
    const response = await apiClient.post("/activities", activity);
    return response.data;
  },

  async updateActivity(activity) {
    const response = await apiClient.put(
      `/activities/${activity.activityId}`,
      activity
    );
    return response.data;
  },

  async deleteActivity(activityId) {
    const response = await apiClient.delete(`/activities/${activityId}`);
    return response.data;
  },

  async getAnalysisData({ userId, startDate, endDate }) {
    const response = await apiClient.get("/analyze", {
      params: { userId, startDate, endDate },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch analysis data");
    }
  },
};

export default apiFacade;
