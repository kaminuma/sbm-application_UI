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
          <router-link to="/upload" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-upload</v-icon>
            <span>一括アップロード</span>
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/settings" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-cog</v-icon>
            <span>設定</span>
          </router-link>
        </li>
        
        <!-- おまけ機能セクション -->
        <li class="sidebar-divider">
          <span class="divider-text">おまけ機能</span>
        </li>
        <li class="sidebar-item">
          <router-link to="/analyze" @click="$emit('close-sidebar')">
            <v-icon class="sidebar-icon">mdi-chart-bar</v-icon>
            <span>生活記録分析</span>
          </router-link>
        </li>
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
.v-theme--light .sidebar {
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

.v-theme--dark .sidebar {
  background-color: rgb(var(--v-theme-surface));
  width: 250px;
  height: 100vh;
  position: fixed;
  z-index: 1000;
  overflow-y: auto;
  left: 0;
  top: 0;
  padding-top: 60px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
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

.v-theme--light .sidebar-item a {
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

.v-theme--dark .sidebar-item a {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  text-decoration: none;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
}

.sidebar-icon {
  margin-right: 16px;
}

.v-theme--light .sidebar-item:hover {
  background-color: #f0f4f8;
}

.v-theme--dark .sidebar-item:hover {
  background-color: rgb(var(--v-theme-surface-variant));
}

.sidebar-divider {
  padding: 12px 20px 8px 20px;
  margin-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.v-theme--light .divider-text {
  color: #999;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.v-theme--dark .divider-text {
  color: #cccccc;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
