<template>
  <transition name="slide">
    <div v-if="isOpen" class="sidebar">
      <div class="close-btn" @click="$emit('close-sidebar')">
        <v-icon>mdi-close</v-icon>
      </div>
      <ul class="sidebar-list">
        <li class="sidebar-item">
          <router-link to="/schedule" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-calendar</v-icon>
            <span>スケジュール表示</span>
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/upload" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-upload</v-icon>
            <span>一括アップロード</span>
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/analyze" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-chart-bar</v-icon>
            <span>生活記録分析</span>
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/mood" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-emoticon-happy</v-icon>
            <span>気分記録</span>
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/ai-analysis" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-robot</v-icon>
            <span>AI分析</span>
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/settings" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-cog</v-icon>
            <span>設定</span>
          </router-link>
        </li>
        <!-- 他のメニュー項目を追加 -->
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #ffffff;
  width: 250px;
  height: 100vh;
  position: fixed;
  z-index: 1000;
  overflow-y: auto;
  left: 0;
  top: 0;
  padding-top: 60px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}

.sidebar-text {
  flex: 1; /* 文字が幅に応じて調整されるように */
}

.sidebar-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  height: 50px;
  display: flex;
  align-items: center;
}

.sidebar-item a {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  text-decoration: none;
  color: #333333;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
}

.sidebar-icon {
  margin-right: 16px;
}

.sidebar-item:hover {
  background-color: #f0f4f8;
}

@media (max-width: 600px) {
  .sidebar {
    width: 200px; /* スマホでは幅を狭く */
  }
  .sidebar-item a {
    font-size: 14px; /* 文字サイズをさらに小さく */
  }
  .sidebar-icon {
    font-size: 18px; /* アイコンサイズを調整 */
  }
}
</style>
