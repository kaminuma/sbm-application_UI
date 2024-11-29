import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    isAuthenticated: false, // 認証状態を管理
    userId: null, // ユーザーIDを格納
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status; // 認証状態を更新
    },
    setUserId(state, userId) {
      state.userId = userId; // userId を保存
    },
  },
  actions: {
    login({ commit }, userId) {
      try {
        commit("setAuthentication", true); // ログイン時に認証状態を true に設定
        commit("setUserId", userId); // 受け取った userId をストアに保存
      } catch (error) {
        console.error("Error in login action:", error); // エラーの詳細を出力
        throw error; // エラーを再スロー
      }
    },
    logout({ commit }) {
      commit("setAuthentication", false); // ログアウト時に認証状態を false に設定
      commit("setUserId", null); // ログアウト時に userId を null に設定
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated, // 認証状態を取得するゲッター
    getUserId: (state) => state.userId, // userId を取得するゲッター
  },
  plugins: [
    createPersistedState({
      key: "vuex-auth",
      storage: window.localStorage,
    }),
  ],
});
