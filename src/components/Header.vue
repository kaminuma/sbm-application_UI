<template>
  <header class="header">
    <h1 class="header-title">sbm-application</h1>
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
.header {
  background-color: #001f3f; /* 紺色 */
  height: 50px; /* 高さ50px */
  display: flex; /* フレックスボックスで配置 */
  align-items: center; /* 縦中央揃え */
  color: white; /* テキストの色を白に */
  padding: 0 20px; /* 左右にパディングを追加 */
}

.header-title {
  margin: 0; /* マージンをリセット */
}
</style>