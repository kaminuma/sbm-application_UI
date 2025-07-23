import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    isAuthenticated: false, // 認証状態を管理
    userId: null, // ユーザーIDを格納
    loading: false, // アプリ全体のローディング状態
    error: null, // グローバルエラーメッセージ
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status; // 認証状態を更新
    },
    setUserId(state, userId) {
      state.userId = userId; // userId を保存
    },
    setLoading(state, isLoading) {
      state.loading = isLoading; // ローディング状態を更新
    },
    setError(state, error) {
      state.error = error; // エラー状態を更新
    },
    clearError(state) {
      state.error = null; // エラーをクリア
    },
  },
  actions: {
    async login({ commit }, userId) {
      try {
        commit("setLoading", true);
        commit("clearError");
        commit("setAuthentication", true); // ログイン時に認証状態を true に設定
        commit("setUserId", userId); // 受け取った userId をストアに保存
      } catch (error) {
        commit("setError", error.message || "ログインに失敗しました"); 
        console.error("Error in login action:", error);
        throw error; // エラーを再スロー
      } finally {
        commit("setLoading", false);
      }
    },
    async register({ commit }, userData) {
      try {
        commit("setLoading", true);
        commit("clearError");
        
        // ユーザーデータの形式をログに出力
        console.log('Vuex register action - userData:', userData);
        
        // userIdが明示的に存在する場合のみ認証状態を更新
        if (userData && userData.userId) {
          commit("setAuthentication", true);
          commit("setUserId", userData.userId);
          console.log('ユーザー登録完了 - userIdを設定:', userData.userId);
        } else {
          console.warn('register action: userIdが見つかりません');
          return false; // 登録は成功したが自動ログインはしない
        }
        
        return true; // 登録・ログイン完了
      } catch (error) {
        commit("setError", error.message || "新規登録に失敗しました");
        console.error("Error in register action:", error);
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },
    logout({ commit }) {
      commit("setAuthentication", false); // ログアウト時に認証状態を false に設定
      commit("setUserId", null); // ログアウト時に userId を null に設定
      commit("clearError");
    },
    clearError({ commit }) {
      commit("clearError");
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated, // 認証状態を取得するゲッター
    getUserId: (state) => state.userId, // userId を取得するゲッター
    isLoading: (state) => state.loading, // ローディング状態を取得するゲッター
    getError: (state) => state.error, // エラー状態を取得するゲッター
  },
  plugins: [
    createPersistedState({
      key: "vuex-auth",
      storage: window.localStorage,
      // デバッグ用に状態変化をログ
      subscriber: (store) => (handler) => {
        return store.subscribe((mutation, state) => {
          console.log('[Vuex] Mutation:', mutation.type, 'with payload:', mutation.payload);
          console.log('[Vuex] New auth state:', state.isAuthenticated);
          handler(mutation, state);
        });
      }
    }),
  ],
});
