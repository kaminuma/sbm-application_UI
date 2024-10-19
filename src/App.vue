<template>
  <div id="app">
    <!-- Header コンポーネントの呼び出し -->
    <Header :title="appTitle" />

    <div class="container">
      <!-- Sidebar コンポーネントの呼び出し -->
      <Sidebar @navigate="changeView" />

      <main>
        <ScheduleView v-if="currentView === 'schedule'" />
        <UploadView v-if="currentView === 'upload'" />
      </main>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import ScheduleView from './components/ScheduleView.vue';
import UploadView from './components/UploadView.vue';

export default {
  components: {
    Header,
    Sidebar,
    ScheduleView,
    UploadView,
  },
  data() {
    return {
      appTitle: 'sbm-application',
      currentView: 'schedule', // デフォルトはスケジュール表示
    };
  },
  methods: {
    changeView(view) {
      this.currentView = view;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.container {
  display: flex;
}

.main-content {
  flex-grow: 1; /* メインコンテンツが余白を占める */
  padding: 20px; /* メインコンテンツのパディング */
}
</style>