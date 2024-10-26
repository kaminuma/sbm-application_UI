<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-title class="headline">
              {{ isRegister ? '新規登録' : 'ログイン' }}
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleSubmit">
                <v-text-field
                  v-model="username"
                  label="ユーザー名"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="パスワード"
                  type="password"
                  required
                ></v-text-field>
                <v-btn type="submit" color="primary">{{ isRegister ? '登録' : 'ログイン' }}</v-btn>
                <v-btn @click="toggleMode" text>{{ isRegister ? 'ログインへ' : '新規登録へ' }}</v-btn>
              </v-form>
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        isRegister: false,
        errorMessage: '',
      };
    },
    methods: {
      toggleMode() {
        this.isRegister = !this.isRegister;
        this.errorMessage = ''; // エラーメッセージをリセット
      },
      async handleSubmit() {
        const url = this.isRegister ? '/auth/register' : '/auth/login';
        const payload = {
          username: this.username,
          password: this.password,
        };
  
        try {
          const response = await axios.post(url, payload);
          if (!this.isRegister) {
            // ログイン成功時の処理
            localStorage.setItem('userId', response.data.id); // ユーザーIDを保存
            // メインメニューにリダイレクト
            this.$router.push('/main-menu');
          }
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = error.response ? error.response.data : '通信エラーが発生しました';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .v-alert {
    margin-top: 20px;
  }
  </style>