<template>
  <v-dialog
    v-model="showDialog"
    max-width="520px"
    persistent
    :content-class="'auth-modal-dialog'"
  >
    <v-card class="auth-card">
      <v-card-title class="text-center pa-6">
        <span class="auth-title">{{ isLogin ? 'ログイン' : 'アカウント作成' }}</span>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="close"
          class="close-btn"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="px-6 py-4">
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- ユーザー名フィールド -->
          <v-text-field
            v-model="username"
            :rules="[
              rules.required,
              rules.usernameMin,
              rules.usernameAlphaNum,
            ]"
            label="ユーザー名"
            variant="outlined"
            density="comfortable"
            bg-color="grey-lighten-5"
            prepend-inner-icon="mdi-account"
            class="mb-4"
            required
          ></v-text-field>

          <!-- メールアドレスフィールド（新規登録時のみ表示） -->
          <v-text-field
            v-if="!isLogin"
            v-model="email"
            :rules="[rules.required, rules.emailFormat]"
            label="メールアドレス"
            variant="outlined"
            density="comfortable"
            bg-color="grey-lighten-5"
            prepend-inner-icon="mdi-email"
            class="mb-4"
            required
          ></v-text-field>

          <!-- パスワードフィールド -->
          <v-text-field
            v-model="password"
            :rules="[
              rules.required,
              rules.passwordMin,
              rules.passwordSpecial,
            ]"
            label="パスワード"
            type="password"
            variant="outlined"
            density="comfortable"
            bg-color="grey-lighten-5"
            prepend-inner-icon="mdi-lock"
            class="mb-4"
            required
          ></v-text-field>

          <!-- パスワード確認フィールド（新規登録時のみ表示） -->
          <v-text-field
            v-if="!isLogin"
            v-model="confirmPassword"
            :rules="[rules.required, rules.matchPassword]"
            label="パスワード(再入力)"
            type="password"
            variant="outlined"
            density="comfortable"
            bg-color="grey-lighten-5"
            prepend-inner-icon="mdi-lock-check"
            required
          ></v-text-field>
        </v-form>

        <!-- エラーメッセージ表示エリア -->
        <v-alert
          v-if="errorMessage"
          type="error"
          class="mt-4"
          variant="tonal"
          closable
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="px-6 py-5">
        <!-- 送信ボタン（ログインまたは登録） -->
        <v-btn
          color="primary"
          @click="submitForm"
          :loading="loading"
          :disabled="!valid || loading"
          variant="elevated"
          block
          height="48"
          rounded="lg"
          class="text-subtitle-1 font-weight-medium auth-submit-btn"
        >
          {{ isLogin ? 'ログイン' : 'アカウント作成' }}
          <v-icon right class="ml-2">{{ isLogin ? 'mdi-login' : 'mdi-account-plus' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <!-- Googleログインボタン（ログイン時のみ表示） -->
      <div v-if="isLogin" class="px-6 pb-5">
        <button
          @click="handleGoogleLogin"
          :disabled="loading"
          class="google-login-btn"
        >
          <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="google-text">Googleでログイン</span>
        </button>
      </div>

      <v-card-text class="text-center pt-0 pb-6">
        <!-- モード切替リンク -->
        <p class="auth-switch-text">
          {{ isLogin ? 'アカウントをお持ちでない方は' : 'すでにアカウントをお持ちの方は' }}
          <a href="#" @click.prevent="toggleAuthMode" class="auth-switch-link">
            {{ isLogin ? '新規登録' : 'ログイン' }}
          </a>
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import apiFacade from "../services/apiFacade";

export default {
  name: "AuthModal",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    defaultMode: {
      type: String,
      default: 'login', // 'login' または 'signup'
      validator: (value) => ['login', 'signup'].includes(value)
    },
    redirectPath: {
      type: String,
      default: '/schedule'
    }
  },
  data() {
    return {
      isLogin: true, // ログインモード or 登録モード
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
      loading: false,
      errorMessage: "",
      showDialog: this.modelValue,
      
      // バリデーションルール
      rules: {
        required: (value) => !!value || "必須項目です",
        emailFormat: (value) => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || "有効なメールアドレスを入力してください";
        },
        usernameMin: (value) =>
          (value && value.length >= 3) || "3文字以上で入力してください",
        usernameAlphaNum: (value) => {
          const pattern = /^[a-zA-Z0-9_]+$/;
          return (
            pattern.test(value) ||
            "英数字とアンダースコアのみ使用できます"
          );
        },
        passwordMin: (value) =>
          (value && value.length >= 8) || "8文字以上で入力してください",
        passwordSpecial: (value) => {
          // 英字・数字・特殊文字を含むパスワードのバリデーション
          // 実際のセキュリティ要件に応じて調整
          return true;
        },
        matchPassword: (value) =>
          value === this.password || "パスワードが一致しません",
      },
    };
  },
  watch: {
    // モーダルの表示状態を外部から制御できるように
    modelValue(newVal) {
      this.showDialog = newVal;
    },
    showDialog(newVal) {
      this.$emit('update:modelValue', newVal);
      if (newVal === false) {
        // モーダルが閉じられたときに通知
        this.$emit('close');
      }
    },
    // デフォルトモードの変更を監視
    defaultMode: {
      immediate: true,
      handler(mode) {
        this.isLogin = mode === 'login';
      }
    }
  },
  methods: {
    ...mapActions(["login", "register"]),
    
    // フォーム送信処理
    async submitForm() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.errorMessage = "";
        
        try {
          let isRegistration = !this.isLogin; // 登録モードかどうかを保存
          
          if (this.isLogin) {
            await this.handleLogin();
            // ログイン後は指定されたリダイレクト先へ遷移
            if (this.redirectPath) {
              this.$router.push(this.redirectPath);
            }
          } else {
            await this.handleRegistration();
            // 新規登録後はランディングページ(/)へ遷移
            this.$router.push('/');
          }
          
          // 成功した場合
          this.$emit('success', { isLogin: this.isLogin });
          this.close();
        } catch (error) {
          console.error("認証エラー:", error);
          this.errorMessage = error.response?.data?.message || 
            (this.isLogin ? "ログインに失敗しました" : "登録に失敗しました");
        } finally {
          this.loading = false;
        }
      }
    },
    
    // ログイン処理
    async handleLogin() {
      const credentials = {
        username: this.username,
        password: this.password,
      };
      
      const response = await apiFacade.login(credentials);
      await this.login(response); // Vuexアクションを呼び出し
    },
    
    // 新規登録処理
    async handleRegistration() {
      // apiFacade.registerは3つの個別のパラメータを期待している
      const response = await apiFacade.register(
        this.username,
        this.email,
        this.password
      );
      console.log('AuthModal - 登録結果:', response);
      
      if (response && response.userId) {
        // ユーザーIDが返された場合は自動ログイン
        await this.register(response); // Vuexアクションを呼び出し
        // 既にログイン済みなので何もしない
      } else {
        // 登録は成功したがユーザーIDがない場合
        alert("登録が完了しました！ログイン画面に移動します。");
        // フォームをリセット（パスワードは消去、ユーザー名は残す）
        this.password = "";
        this.confirmPassword = "";
        this.email = "";
        this.errorMessage = "";
        
        // フォームの検証状態もリセット
        if (this.$refs.form) {
          this.$refs.form.resetValidation();
        }
      }
    },
    
    // ログイン/登録モードの切り替え
    toggleAuthMode() {
      this.isLogin = !this.isLogin;
      this.errorMessage = "";
      
      // フォームをリセット
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    },
    
    // Googleログイン処理
    handleGoogleLogin() {
      const oauthBaseUrl = import.meta.env.VITE_OAUTH2_BASE_URL;
      window.location.href = `${oauthBaseUrl}/oauth2/authorization/google`;
    },
    
    // モーダルを閉じる
    close() {
      this.showDialog = false;
      this.errorMessage = "";
      
      // フォームをリセット
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    }
  }
};
</script>

<style scoped>
.auth-modal-dialog {
  border-radius: 8px;
  overflow: hidden;
}

/* その他のスタイルを必要に応じて追加 */
.auth-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.auth-title {
  font-size: 1.8rem !important;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
  display: block;
  width: 100%;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.auth-submit-btn {
  text-transform: none !important;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(69, 104, 220, 0.3) !important;
  transition: all 0.3s ease !important;
}

.auth-submit-btn:hover {
  box-shadow: 0 6px 20px rgba(69, 104, 220, 0.4) !important;
  transform: translateY(-2px);
}

.auth-switch-text {
  font-size: 0.95rem;
  color: #4a5568;
  margin-top: 1rem;
}

.auth-switch-link {
  color: #4568dc;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.auth-switch-link:hover {
  color: #3755c4;
  text-decoration: underline;
}

.auth-modal-dialog {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

/* Google公式ボタンスタイル */
.google-login-btn {
  width: 100%;
  height: 44px;
  background-color: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #3c4043;
  text-decoration: none;
  padding: 0 12px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.google-login-btn:hover {
  background-color: #f8f9fa;
  border-color: #c1c7cd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.google-login-btn:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
}

.google-login-btn:disabled {
  background-color: #f1f3f4;
  border-color: #dadce0;
  color: #9aa0a6;
  cursor: not-allowed;
  box-shadow: none;
}

.google-icon {
  margin-right: 8px;
  flex-shrink: 0;
}

.google-text {
  line-height: 1;
}
</style>
