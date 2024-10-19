<template>
    <nav>
      <ul>
        <li><a href="#" @click.prevent="navigate('schedule')">スケジュール表示</a></li>
        <li><a href="#" @click.prevent="navigate('upload')">一括アップロード</a></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    methods: {
      navigate(view) {
        this.$emit('navigate', view);
      },
    },
  };
  </script>
  
  <style scoped>
  nav {
    width: 200px; /* サイドバーの幅を固定 */
    background-color: #f8f8f8;
    padding: 1rem;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* シャドウを追加 */
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin: 1rem 0;
  }
  
  a {
    text-decoration: none;
    color: #333;
  }
  </style>