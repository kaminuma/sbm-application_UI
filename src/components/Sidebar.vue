<template>
  <div class="sidebar">
      <ul class="sidebar-list">
          <li class="sidebar-item">
                <router-link to="/">スケジュール表示</router-link>
          </li>
          <li class="sidebar-item">
                  <router-link to="/upload">一括アップロード</router-link>
          </li>
      </ul>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'Sidebar',
      setup() {
          const router = useRouter();
          
          const navigateTo = (routeName) => {
              router.push({ name: routeName });
          };

          return {
              navigateTo,
          };
      },
  };
</script>

<style scoped>
.sidebar {
  background-color: #f9e79f; /* 薄い黄色 */
  width: 200px; /* 横幅300px */
  height: 100vh; /* 高さをブラウザのビューポートに合わせる */
  display: flex; /* フレックスボックスで配置 */
  flex-direction: column; /* 縦に配置 */
}

.sidebar-list {
  list-style-type: none; /* リストのデフォルトスタイルを解除 */
  padding: 0; /* パディングをリセット */
  margin: 0; /* マージンをリセット */
}

.sidebar-item {
  height: 50px; /* 各項目の高さを50pxに設定 */
  display: flex; /* フレックスボックスで配置 */
  align-items: center; /* 縦中央揃え */
  padding: 0 20px; /* 左右にパディングを追加 */
  cursor: pointer; /* ホバー時にカーソルをポインタに変更 */
}

.sidebar-item:hover {
  background-color: #e0e0e0; /* ホバー時の背景色 */
}
</style>