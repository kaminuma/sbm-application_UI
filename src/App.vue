<template>
  <div id="app">
    <HeaderComponent />
    <div class="layout">
      <SidebarComponent v-if="isAuthenticated" />
      <main class="main-content">
        <router-view /> <!-- ルートに応じたコンポーネントがここに表示される -->
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import HeaderComponent from './components/Header.vue';
import SidebarComponent from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.state.isAuthenticated);

    return {
      isAuthenticated,
    };
  },
  methods: {
    checkToken() {
      const token = localStorage.getItem('token');

      if (token) {
        // トークンが存在する場合、有効期限をチェック
        if (this.isTokenExpired(token)) {
          // 有効期限が切れている場合、ログイン画面にリダイレクト
          this.$router.push('/login');
        } else {
          // トークンをヘッダーに追加
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } else {
        // トークンが存在しない場合、ログイン画面にリダイレクト
        this.$router.push('/login');
      }
    },
    isTokenExpired(token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    },
  },
};
</script>

<style>
.layout {
  display: flex;
  height: calc(100vh - 50px);
}

.main-content {
  flex-grow: 1;
  padding: 20px;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh; /* ビュー全体を占める */
}

.layout {
  display: flex;
  flex-grow: 1; /* 余白を利用 */
}

.main-content {
  flex-grow: 1;
  padding: 20px;
}
</style>
