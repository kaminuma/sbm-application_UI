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
import { setAuthToken, clearAllAuthData } from "./services/authUtils";

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
    }
  },
  created() {
    const token = localStorage.getItem("token");
    console.log("LocalStorage token:", token);
    console.log("Initial auth state:", this.$store.getters.isAuthenticated);
    
    if (token) {
      this.setAuthentication(true); // Vuexに認証状態を設定
      setAuthToken(); // Axiosにトークンを設定
    } else {
      // トークンがない場合は認証状態をリセット
      this.setAuthentication(false);
    }
    
    console.log("Current route:", this.$route.path);
    console.log("Is landing page:", this.$route.name === 'LandingPage');
    console.log("Auth state after check:", this.$store.getters.isAuthenticated);
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
body {
  font-family: "Poppins", sans-serif;
  background-color: rgb(var(--v-theme-background)) !important;
  color: rgb(var(--v-theme-on-background)) !important;
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

/* 共通テーマ対応スタイル */
/* ライトモード */
.v-theme--light .theme-bg-white {
  background: white;
}

.v-theme--light .theme-text-primary {
  color: #333;
}

.v-theme--light .theme-text-secondary {
  color: #666;
}

.v-theme--light .theme-text-blue {
  color: #2196f3;
}

/* ダークモード */
.v-theme--dark .theme-bg-white {
  background: rgb(var(--v-theme-surface));
}

.v-theme--dark .theme-text-primary {
  color: #ffffff; /* より明るく */
}

.v-theme--dark .theme-text-secondary {
  color: #cccccc; /* より明るく */
}

.v-theme--dark .theme-text-blue {
  color: #64b5f6; /* より明るく */
}
</style>
