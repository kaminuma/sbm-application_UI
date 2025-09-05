<template>
  <v-dialog
    v-model="showDialog"
    max-width="520px"
    persistent
    :content-class="'auth-modal-dialog'"
    @click:outside="handleOutsideClick"
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
          :type="errorType === 'ACCOUNT_LOCKED' ? 'warning' : 'error'"
          class="mt-4"
          variant="tonal"
          closable
          @click:close="clearError"
        >
          <div class="error-message">
            <template v-for="(line, index) in errorMessageLines" :key="index">
              {{ line }}<br v-if="index < errorMessageLines.length - 1">
            </template>
          </div>
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
      errorType: null, // エラータイプを追加
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
  computed: {
    // エラーメッセージを改行で分割して安全に表示
    errorMessageLines() {
      if (!this.errorMessage) return [];
      // 改行で分割して配列として返す（XSS対策）
      return this.errorMessage.split('\n');
    }
  },
  methods: {
    ...mapActions(["login", "register"]),
    
    // フォーム送信処理
    async submitForm() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.errorMessage = "";
        this.errorType = null;
        
        try {
          let isRegistration = !this.isLogin; // 登録モードかどうかを保存
          
          if (this.isLogin) {
            await this.handleLogin();
            // ログイン後は指定されたリダイレクト先へ遷移
            if (this.redirectPath) {
              this.$router.push(this.redirectPath);
            }
            // ログイン成功時のみモーダルを閉じる
            this.$emit('success', { isLogin: this.isLogin });
            this.close();
          } else {
            await this.handleRegistration();
            // 新規登録後はランディングページ(/)へ遷移
            this.$router.push('/');
            // 登録成功時のみモーダルを閉じる
            this.$emit('success', { isLogin: this.isLogin });
            this.close();
          }
        } catch (error) {
          console.error("認証エラー:", error);
          
          // エラーメッセージとタイプを設定
          if (error.message && error.errorType) {
            // apiFacadeから返されたエラーオブジェクト
            this.errorMessage = error.message;
            this.errorType = error.errorType;
          } else {
            // その他のエラー
            this.errorMessage = error.response?.data?.message || 
              (this.isLogin ? "ログインに失敗しました" : "登録に失敗しました");
            this.errorType = null;
          }
          
          // エラー時はモーダルを閉じない
          // パスワードもクリアしない（ユーザーが修正しやすいように）
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
      this.errorType = null;
      
      // フォームをリセット
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    },
    
    // エラーメッセージをクリア
    clearError() {
      this.errorMessage = "";
      this.errorType = null;
    },
    
    // 外側クリック時の処理（エラーがある場合は閉じない）
    handleOutsideClick() {
      if (this.errorMessage) {
        // エラーメッセージがある場合は閉じない
        console.log('エラーがあるため、モーダルを閉じません');
        return;
      }
      // エラーがない場合のみ閉じる
      this.close();
    },
    
    // モーダルを閉じる
    close() {
      this.showDialog = false;
      this.errorMessage = "";
      this.errorType = null;
      
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

/* エラーアラートのスタイル */
.v-alert {
  border-radius: 8px;
}

.v-alert div {
  line-height: 1.6;
  font-size: 0.95rem;
}

</style>
