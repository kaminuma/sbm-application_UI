<template>
    <div>
      <h2>一括アップロード画面</h2>
      <input type="file" @change="handleFileUpload" multiple />
      <button @click="uploadFiles">アップロード</button>
  
      <div v-if="selectedFiles.length">
        <h3>選択されたファイル:</h3>
        <ul>
          <li v-for="file in selectedFiles" :key="file.name">{{ file.name }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UploadView',
    data() {
      return {
        selectedFiles: [],
      };
    },
    methods: {
      handleFileUpload(event) {
        this.selectedFiles = Array.from(event.target.files);
      },
      uploadFiles() {
        if (this.selectedFiles.length === 0) {
          alert('ファイルが選択されていません。');
          return;
        }
  
        // 実際のアップロード処理はここに実装
        alert('アップロード処理を実装してください。');
      },
    },
  };
  </script>
  
  <style scoped>
  input[type="file"] {
    margin-bottom: 1rem;
  }
  
  button {
    margin-top: 1rem;
  }
  </style>