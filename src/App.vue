<template>
  <div id="app">
    <HeaderComponent />
    <div class="layout">
      <SidebarComponent />
      <main class="main-content">
        <router-view /> <!-- ルートに応じたコンポーネントがここに表示される -->
      </main>
    </div>
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue';
import SidebarComponent from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    SidebarComponent,
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