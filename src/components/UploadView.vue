<template>
  <div class="upload-view">
    <h2>一括アップロード</h2>
    <v-form @submit.prevent="uploadFile">
      <v-file-input
        v-model="selectedFile"
        label="ファイルを選択"
        prepend-icon="mdi-upload"
        @change="onFileChange"
        required
      />
      <v-btn type="submit" color="primary">アップロード</v-btn>
    </v-form>
  </div>
</template>

<script>
import apiFacade from '../services/apiFacade';

export default {
  name: 'UploadView',
  data() {
    return {
      selectedFile: null,
      fileName: ''
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0]; // 選択したファイルを保存
      this.fileName = this.selectedFile ? this.selectedFile.name : '';
    },

    async uploadFile() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        try {
          await apiFacade.uploadExcelFile(formData);
          alert('ファイルが正常にアップロードされました！'); 
        } catch (error) {
          alert('ファイルのアップロードに失敗しました。'); 
        }
      }
    },
  },
};
</script>

<style scoped>
.upload-view {
  padding: 20px;
}
</style>
