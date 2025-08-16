<template>
  <div class="callback-container">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="callback-card" elevation="8">
            <v-card-text class="text-center pa-8">
              <div v-if="loading">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                  width="4"
                  class="mb-4"
                ></v-progress-circular>
                <h3 class="text-h6 mb-2">ログイン処理中...</h3>
                <p class="text-body-2 text-grey-darken-1">
                  しばらくお待ちください
                </p>
              </div>
              
              <div v-if="error" class="error-content">
                <v-icon
                  color="error"
                  size="64"
                  class="mb-4"
                >
                  mdi-alert-circle
                </v-icon>
                <h3 class="text-h6 mb-2 text-error">エラーが発生しました</h3>
                <p class="text-body-2 text-grey-darken-1 mb-4">
                  {{ errorMessage }}
                </p>
                <v-btn
                  color="primary"
                  variant="elevated"
                  @click="redirectToLogin"
                  rounded="lg"
                >
                  ログインページに戻る
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginCallback",
  data() {
    return {
      loading: true,
      error: false,
      errorMessage: ""
    };
  },
  
  async mounted() {
    await this.processCallback();
  },
  
  methods: {
    ...mapActions(["login"]),
    
    async processCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session');
      const error = urlParams.get('error');

      // エラーがある場合
      if (error) {
        this.showError('ログインに失敗しました');
        setTimeout(() => {
          this.redirectToLogin();
        }, 3000);
        return;
      }

      // セッションIDがない場合
      if (!sessionId) {
        this.showError('セッションIDが見つかりません');
        setTimeout(() => {
          this.redirectToLogin();
        }, 3000);
        return;
      }

      try {
        // JWTトークンを取得
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/auth/oauth2/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `sessionId=${sessionId}`
        });

        if (!response.ok) {
          throw new Error('トークン取得に失敗しました');
        }

        const data = await response.json();

        if (data.token && data.userId) {
          // トークンをローカルストレージに保存
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          
          // Vuexストアを更新
          await this.login({
            token: data.token,
            userId: data.userId
          });
          
          // スケジュールページへリダイレクト
          this.$router.push('/schedule');
        } else {
          throw new Error('無効なレスポンス');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        this.showError(err.message || 'ログイン処理でエラーが発生しました');
        setTimeout(() => {
          this.redirectToLogin();
        }, 3000);
      } finally {
        this.loading = false;
      }
    },
    
    showError(message) {
      this.error = true;
      this.errorMessage = message;
      this.loading = false;
    },
    
    redirectToLogin() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.callback-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.callback-card {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.error-content {
  max-width: 300px;
  margin: 0 auto;
}

.v-progress-circular {
  margin: 0 auto;
}
</style>