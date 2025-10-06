<template>
  <v-app :theme="currentTheme">
    <!-- グローバルローディングインジケーター -->
    <div v-if="isLoading" class="global-loading-overlay">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>
    
    <!-- グローバルエラー通知 -->
    <v-snackbar
      v-model="showError"
      :timeout="5000"
      color="error"
      location="top"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="clearErrorMessage"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
    
    
    <!-- ランディングページ以外の場合のみヘッダーとサイドバーを表示 -->
    <template v-if="!isLandingPage">
      <Header :showMenu="showMenu" @toggle-sidebar="toggleSidebar" />
      <Sidebar
        v-if="showMenu"
        :isOpen="isSidebarOpen"
        @close-sidebar="toggleSidebar"
      />
    </template>
    
    <!-- メインコンテンツ -->
    <v-main :class="{ 'landing-page-main': isLandingPage }">
      <router-view @update:showMenu="updateShowMenu" />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import { mapActions, mapGetters } from "vuex";
import { setAuthToken, clearAllAuthData, refreshAccessToken, getRefreshToken } from "./services/authUtils";
import logger from "./utils/logger";

export default {
  components: {
    Header,
    Sidebar,
  },
  data() {
    return {
      isSidebarOpen: false,
      showMenu: true,
      showError: false,
      errorMessage: "",
    };
  },
  computed: {
    ...mapGetters(["isLoading", "getError", "getTheme"]),
    
    isLandingPage() {
      // ルートがランディングページの場合はtrue
      return this.$route.name === 'LandingPage';
    },
    currentTheme() {
      return this.getTheme;
    }
  },
  watch: {
    getError(error) {
      if (error) {
        this.errorMessage = error;
        this.showError = true;
      }
    },
    getTheme(newTheme) {
      this.updateThemeAttribute();
    }
  },
  async created() {
    // トークンベースで認証状態を初期化
    const token = localStorage.getItem("token");
    const refreshToken = getRefreshToken();

    logger.debug("Initial auth check", { hasToken: !!token, hasRefreshToken: !!refreshToken });

    if (token) {
      // アクセストークンがある場合
      this.setAuthentication(true);
      setAuthToken();
    } else if (refreshToken) {
      // アクセストークンはないがリフレッシュトークンがある場合
      // リフレッシュ中は認証状態を一時的にfalseに設定（router guardでのリダイレクトを防ぐ）
      this.setAuthentication(false);

      try {
        logger.info("Attempting to refresh access token on app start");
        await refreshAccessToken();

        // リフレッシュ成功後、実際にトークンが保存されたか確認
        const newToken = localStorage.getItem("token");
        if (newToken) {
          this.setAuthentication(true);
          logger.info("Access token refreshed successfully");
        } else {
          this.setAuthentication(false);
          logger.warn("Access token refresh did not yield a valid token");
          clearAllAuthData();
        }
      } catch (error) {
        logger.warn("Failed to refresh token on app start:", error.message);
        // リフレッシュ失敗時は認証状態をリセット
        this.setAuthentication(false);
        clearAllAuthData();
      }
    } else {
      // トークンが何もない場合は認証状態をリセット
      this.setAuthentication(false);
    }

    // テーマ初期化（ダークモード無効化対応含む）
    this.$store.dispatch('initializeTheme');

    // data-theme属性を設定
    this.updateThemeAttribute();
  },
  methods: {
    ...mapActions(["setAuthentication", "clearError"]),

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    updateShowMenu(value) {
      this.showMenu = value;
      if (!value) {
        this.isSidebarOpen = false;
      }
    },
    clearErrorMessage() {
      this.showError = false;
      this.clearError();
    },
    updateThemeAttribute() {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', this.getTheme);
      }
    },
    // デバッグ用：認証状態をリセットしてランディングページに移動
    resetAuthAndRedirect() {
      clearAllAuthData();
      this.setAuthentication(false);
      this.$store.commit("setUserId", null);
      console.log("Auth reset. New state:", this.$store.getters.isAuthenticated);
      this.$router.push("/");
    },
  },
  watch: {
    $route(to) {
      // ルートが変更されたときにランディングページかどうかをチェック
      if (to.name === 'LandingPage') {
        this.updateShowMenu(false);
      } else if (!this.showMenu && to.name !== 'LandingPage') {
        this.updateShowMenu(true);
      }
    }
  }
};
</script>

<style>
/* Google Fonts読み込み */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

body {
  font-family: "Poppins", sans-serif;
}

/* テーマ別bodyスタイル */
.v-theme--light body {
  background-color: #f0f4f8;
  font-family: "Poppins", sans-serif;
}

.v-theme--dark body {
  background-color: rgb(var(--v-theme-background));
  font-family: "Poppins", sans-serif;
}

.v-theme--light .v-application {
  background-color: #f0f4f8;
}

.v-theme--dark .v-application {
  background-color: rgb(var(--v-theme-background));
}
.landing-page-main {
  padding: 0 !important; /* ランディングページのメインコンテンツではパディングをなくす */
}

/* グローバルローディングインジケーター */
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* グローバルCSS変数システム */
:root {
  /* ライトモード（デフォルト）*/
  --theme-text-primary: #333333;
  --theme-text-secondary: #666666;
  --theme-text-tertiary: #999999;
  --theme-text-muted: #555555;
  --theme-bg-surface: #ffffff;
  --theme-bg-primary: #f0f4f8;
  --theme-bg-secondary: #f8f9fa;
  --theme-bg-hover: #f5f5f5;
  --theme-accent-blue: #2196f3;
  --theme-accent-blue-hover: #1976d2;
  --theme-accent-green: #4caf50;
  --theme-accent-red: #f44336;
  --theme-accent-purple: #d63aff;
  --theme-outline: #e0e0e0;
  --theme-outline-light: #f0f0f0;
  --theme-outline-strong: #ddd;
  --theme-border: #e2e8f0;
  --theme-link: #3182ce;
  --theme-link-hover: #2c5aa0;
}

/* ダークモード変数 */
[data-theme="dark"] {
  --theme-text-primary: #ffffff;
  --theme-text-secondary: #cccccc;
  --theme-text-tertiary: #999999;
  --theme-text-muted: #888888;
  --theme-bg-surface: #1e1e1e;
  --theme-bg-primary: #121212;
  --theme-bg-secondary: #2d2d2d;
  --theme-bg-hover: #333333;
  --theme-accent-blue: #64b5f6;
  --theme-accent-blue-hover: #42a5f5;
  --theme-accent-green: #4caf50;
  --theme-accent-red: #f44336;
  --theme-accent-purple: #d63aff;
  --theme-outline: #444444;
  --theme-outline-light: #555555;
  --theme-outline-strong: #666666;
  --theme-border: #444444;
  --theme-link: #64b5f6;
  --theme-link-hover: #42a5f5;
}

/* 共通ユーティリティクラス */
.theme-text-primary {
  color: var(--theme-text-primary) !important;
}

.theme-text-secondary {
  color: var(--theme-text-secondary) !important;
}

.theme-bg-surface {
  background-color: var(--theme-bg-surface) !important;
}

.theme-bg-primary {
  background-color: var(--theme-bg-primary) !important;
}

.theme-text-blue {
  color: var(--theme-accent-blue) !important;
}

/* ユーティリティクラス */
.theme-bg-white {
  background: var(--theme-bg-surface) !important;
}
</style>
