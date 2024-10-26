// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false, // 認証状態を管理
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status; // 認証状態を更新
    },
  },
  actions: {
    login({ commit }) {
        try {
            commit('setAuthentication', true); // ログイン時に認証状態を true に設定
        } catch (error) {
            console.error('Error in login action:', error); // エラーの詳細を出力
            throw error; // エラーを再スロー
        }
    },
    logout({ commit }) {
      commit('setAuthentication', false); // ログアウト時に認証状態を false に設定
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated, // 認証状態を取得するゲッター
  },
});
