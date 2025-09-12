import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { THEME_CONFIG, isThemeEnabled } from "../config/theme";

export default createStore({
  state: {
    isAuthenticated: false, // 認証状態を管理
    userId: null, // ユーザーIDを格納
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
        console.warn(`Theme "${theme}" is not enabled in configuration`);
      }
    },
  },
  actions: {
    async login({ commit }, payload) {
      try {
        commit("setLoading", true);
        commit("clearError");
        
        // payloadがオブジェクトの場合（OAuth2ログイン）とuserIdのみの場合（通常ログイン）を処理
        let userId;
        if (typeof payload === 'object' && payload !== null) {
          // OAuth2ログインの場合: { token, userId }
          userId = payload.userId;
          console.log('OAuth2 login - token and userId received:', payload);
        } else {
          // 通常ログインの場合: userIdのみ
          userId = payload;
          console.log('Regular login - userId received:', userId);
        }
        
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
      
      // ローカルストレージからトークンとユーザーIDを削除
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      console.log('Logout - token and userId removed from localStorage');
    },
    clearError({ commit }) {
      commit("clearError");
    },
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      commit('setTheme', newTheme);
      return true;
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
        console.warn('Failed to parse stored theme data:', e);
        savedTheme = null;
      }
      
      // システム設定の検出
      let systemTheme = 'light';
      if (typeof window !== 'undefined' && window.matchMedia) {
        systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // 優先順位: 保存済み設定 > システム設定 > デフォルト設定
      // 明示的にnull/undefinedチェック
      const targetTheme = savedTheme !== null ? savedTheme : systemTheme || THEME_CONFIG.DEFAULT_THEME;
      
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
