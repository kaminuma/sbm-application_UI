<template>
    <div class="upload-view">
      <h2>一括アップロード</h2>
      <v-form @submit.prevent="uploadFiles">
        <v-file-input
          v-model="files"
          multiple
          label="ファイルを選択"
          prepend-icon="mdi-upload"
          required
        />
        <v-btn type="submit" color="primary">アップロード</v-btn>
      </v-form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UploadView',
    data() {
      return {
        files: null,
      };
    },
    methods: {
      uploadFiles() {
        // アップロード処理をここに実装します
        alert('アップロードするファイル: ' + this.files.length + '個');
      },
    },
  };
  </script>
  
  <style scoped>
  .upload-view {
    padding: 20px;
  }
  </style>
  