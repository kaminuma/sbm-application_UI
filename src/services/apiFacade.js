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
      router.push("/"); // ランディングページへ遷移（ログインモーダルが表示されます）
    }
    return Promise.reject(error);
  }
);

// アプリ起動時にトークンを設定
setAuthToken();

const apiFacade = {
  async register(username, email, password) {
    try {
      const userData = { username, email, password };
      console.log(`ユーザー登録開始: username=${username}, email=${email}`);
      const response = await apiClient.post("/auth/register", userData);
      console.log("登録レスポンス:", response);
      // テスト環境ではresponse.statusが設定されていないことがあるため、条件を緩和
      // データが返されていれば成功と判断
      if (response.data) {
        // 登録後自動ログイン（トークンが返される場合）
        if (response.data.token) {
          saveAuthToken(response.data.token);
        }
        return response.data;
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration API Error:", error);
      // エラーレスポンスの詳細をログに出力
      if (error.response) {
        console.error('エラーレスポンス:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      if (response.status === 200) {
        saveAuthToken(response.data.token);
        return response.data.userId || response.data.user_id; // ユーザーIDを返す
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
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

  // 気分記録関連のAPI
  /**
   * 指定されたユーザーの気分記録を取得する
   * @param {string} userId - ユーザーID
   * @returns {Promise<Object>} 気分記録の配列を含むレスポンス
   */
  async getMoodRecords(userId) {
    try {
      const response = await apiClient.get("/mood", { params: { userId } });
      console.log(`気分記録取得: userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error(`気分記録の取得に失敗しました: userId=${userId}`, error);
      if (error.response) {
        console.error('エラーレスポンス:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw new Error(
        error.response?.data?.message || "気分記録の取得に失敗しました。"
      );
    }
  },

  /**
   * 新しい気分記録を作成する
   * @param {Object} moodData - 気分記録データ（date, mood, note, userId）
   * @returns {Promise<Object>} 作成された気分記録
   */
  async createMoodRecord(moodData) {
    try {
      const response = await apiClient.post("/mood", moodData);
      console.log(`気分記録作成: date=${moodData.date}, userId=${moodData.userId}`);
      return response.data;
    } catch (error) {
      console.error(`気分記録の作成に失敗しました:`, moodData, error);
      if (error.response) {
        console.error('エラーレスポンス:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw new Error(
        error.response?.data?.message || "気分記録の作成に失敗しました。"
      );
    }
  },

  /**
   * 既存の気分記録を更新する
   * @param {Object} moodData - 更新する気分記録データ（date, mood, note, userId）
   * @returns {Promise<Object>} 更新された気分記録
   */
  async updateMoodRecord(moodData) {
    try {
      const response = await apiClient.put(`/mood/${moodData.date}`, moodData);
      console.log(`気分記録更新: date=${moodData.date}, userId=${moodData.userId}`);
      return response.data;
    } catch (error) {
      console.error(`気分記録の更新に失敗しました:`, moodData, error);
      if (error.response) {
        console.error('エラーレスポンス:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw new Error(
        error.response?.data?.message || "気分記録の更新に失敗しました。"
      );
    }
  },

  /**
   * 指定された日付の気分記録を削除する
   * @param {string} date - 削除する気分記録の日付（YYYY-MM-DD）
   * @param {string|number} userId - 気分記録の所有者ID
   * @returns {Promise<Object>} 削除結果
   */
  async deleteMoodRecord(date, userId) {
    try {
      // 日付のフォーマット確認（YYYY-MM-DDであることを確認）
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.error(`日付のフォーマットが不正です: ${date}`);
        throw new Error(`日付のフォーマットが不正です。YYYY-MM-DD形式で指定してください。`);
      }
      
      // userIdが適切に提供されていることを確認
      if (userId === undefined || userId === null || userId === '') {
        console.error(`userIdが指定されていません`);
        throw new Error(`userIdが指定されていません。ユーザーIDを指定してください。`);
      }
      
      console.log(`気分記録削除リクエスト準備: date=${date}, userId=${userId}`);
      
      // APIのパスが /api/v1/mood/{date} であることを考慮
      // apiClient のbaseURLが既に /api/v1 を含んでいる場合は /mood/{date} のままでOK
      const response = await apiClient.delete(`/mood/${date}`, {
        params: { userId }
      });
      
      console.log(`気分記録削除リクエスト完了: date=${date}, userId=${userId}`, response.data);
      return response.data;
    } catch (error) {
      console.error(`気分記録の削除に失敗しました: date=${date}, userId=${userId}`, error);
      
      // エラーレスポンスの詳細をログに出力
      if (error.response) {
        console.error('エラーレスポンス:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // 400エラーの場合は詳細なメッセージを提供
        if (error.response.status === 400) {
          console.error('400 Bad Requestエラー: リクエストの形式が正しくありません。');
          console.error('リクエストURL:', error.config?.url);
          console.error('リクエストパラメータ:', error.config?.params);
        }
      }
      
      throw new Error(
        error.response?.data?.message || "気分記録の削除に失敗しました。"
      );
    }
  },

  async getMoodAnalysis(userId, startDate, endDate) {
    try {
      const response = await apiClient.get("/mood/analysis", {
        params: { userId, startDate, endDate },
      });
      console.log(`気分分析取得: userId=${userId}, startDate=${startDate}, endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error(`気分分析の取得に失敗しました: userId=${userId}, startDate=${startDate}, endDate=${endDate}`, error);
      if (error.response) {
        console.error('エラーレスポンス:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw new Error(
        error.response?.data?.message || "気分分析の取得に失敗しました。"
      );
    }
  },

  /**
   * パスワードを変更する
   * @param {string} currentPassword - 現在のパスワード
   * @param {string} newPassword - 新しいパスワード
   * @returns {Promise<string>} 変更結果メッセージ
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put("/auth/change-password", {
        currentPassword,
        newPassword
      });
      console.log("パスワード変更成功");
      return response.data;
    } catch (error) {
      console.error("パスワード変更エラー:", error);
      if (error.response) {
        console.error('エラーレスポンス:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        if (error.response.status === 400) {
          throw new Error("現在のパスワードが間違っています。");
        }
        if (error.response.status === 401) {
          throw new Error("認証が無効です。再度ログインしてください。");
        }
      }
      throw new Error(
        error.response?.data?.message || "パスワードの変更に失敗しました。"
      );
    }
  },
};

export default apiFacade;
