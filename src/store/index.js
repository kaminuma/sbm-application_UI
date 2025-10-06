import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { THEME_CONFIG, isThemeEnabled } from "../config/theme";
import { saveAuthTokens, getRefreshToken, clearAuthTokens } from "../services/authUtils";
import logger from "../utils/logger";

export default createStore({
  state: {
    isAuthenticated: false, // 認証状態を管理
    userId: null, // ユーザーIDを格納
    refreshToken: null, // リフレッシュトークンを格納
    loading: false, // アプリ全体のローディング状態
    error: null, // グローバルエラーメッセージ
    theme: THEME_CONFIG.DEFAULT_THEME, // テーマ設定 ('light' または 'dark')
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status; // 認証状態を更新
    },
    setUserId(state, userId) {
      state.userId = userId; // userId を保存
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
    clearRefreshToken(state) {
      state.refreshToken = null;
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
    setTheme(state, theme) {
      // 設定で有効なテーマかチェック
      if (isThemeEnabled(theme)) {
        state.theme = theme; // テーマを更新
        // data-theme属性も更新
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      } else {
        logger.warn(`Theme "${theme}" is not enabled in configuration`);
      }
    },
  },
  actions: {
    async login({ commit }, payload) {
      try {
        commit("setLoading", true);
        commit("clearError");

        let userId, token, refreshToken;
        if (typeof payload === 'object' && payload !== null) {
          // OAuth2またはリフレッシュトークン対応ログイン
          userId = payload.userId;
          token = payload.token;
          refreshToken = payload.refreshToken;
        } else {
          // 通常ログインの場合: userIdのみ
          userId = payload;
        }

        commit("setAuthentication", true);
        commit("setUserId", userId);

        if (token && refreshToken) {
          commit("setRefreshToken", refreshToken);
          // authUtilsで保存
          saveAuthTokens(token, refreshToken);
        }
      } catch (error) {
        commit("setError", error.message || "ログインに失敗しました");
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },
    async register({ commit }, userData) {
      try {
        commit("setLoading", true);
        commit("clearError");
        
        // ユーザー登録処理開始
        logger.debug('Starting user registration');
        
        // userIdが明示的に存在する場合のみ認証状態を更新
        if (userData && userData.userId) {
          commit("setAuthentication", true);
          commit("setUserId", userData.userId);
          logger.info('User registration completed successfully');
        } else {
          logger.warn('User registration: userId not found in response');
          return false; // 登録は成功したが自動ログインはしない
        }
        
        return true; // 登録・ログイン完了
      } catch (error) {
        commit("setError", error.message || "新規登録に失敗しました");
        logger.error("Registration error:", error.message);
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },
    async logout({ commit }) {
      try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          // サーバーにログアウト通知（エラーは無視）
          try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken })
            });
          } catch (error) {
            logger.warn('Server logout failed:', error.message);
          }
        }

        // クライアント側クリーンアップ
        commit("setAuthentication", false);
        commit("setUserId", null);
        commit("clearRefreshToken");
        commit("clearError");
        clearAuthTokens();
      } catch (error) {
        logger.error('Logout error:', error.message);
      }
    },
    clearError({ commit }) {
      commit("clearError");
    },
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      if (isThemeEnabled(newTheme)) {
        commit('setTheme', newTheme);
        return true;
      } else {
        logger.warn(`Attempted to set invalid theme: ${newTheme}`);
        return false;
      }
    },
    setTheme({ commit }, theme) {
      // 設定チェック済みのため、commitに委譲
      commit('setTheme', theme);
      return isThemeEnabled(theme);
    },
    initializeTheme({ commit }) {
      // アプリ起動時のテーマ初期化
      let savedTheme = null;
      try {
        const storedData = localStorage.getItem('vuex-auth');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          // パースされたオブジェクトからテーマを正しく抽出
          savedTheme = parsed?.theme || null;
        }
      } catch (e) {
        logger.warn('Failed to parse stored theme data:', e.message);
        savedTheme = null;
      }
      
      // システム設定の検出
      let systemTheme = 'light';
      if (typeof window !== 'undefined' && window.matchMedia) {
        systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // 優先順位: 保存済み設定 > システム設定
      // 明示的にnull/undefinedチェック
      const targetTheme = savedTheme !== null ? savedTheme : systemTheme;
      
      commit('setTheme', targetTheme);
      return targetTheme;
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated, // 認証状態を取得するゲッター
    getUserId: (state) => state.userId, // userId を取得するゲッター
    isLoading: (state) => state.loading, // ローディング状態を取得するゲッター
    getError: (state) => state.error, // エラー状態を取得するゲッター
    getTheme: (state) => state.theme, // テーマを取得するゲッター
  },
  plugins: [
    createPersistedState({
      key: "vuex-auth",
      storage: window.localStorage,
      // 永続化する項目を制限（isAuthenticatedはtokenから算出するため除外）
      paths: ['userId', 'theme'],
      // 開発環境でのみ状態変化をログ
      subscriber: (store) => (handler) => {
        return store.subscribe((mutation, state) => {
          logger.debug(`Vuex mutation: ${mutation.type}`, {
            authState: state.isAuthenticated
          });
          handler(mutation, state);
        });
      }
    }),
  ],
});
