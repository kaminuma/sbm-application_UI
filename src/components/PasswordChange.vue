<template>
  <v-main>
    <div class="content-container">
      <div class="password-header">
        <h2>🔒 パスワード変更</h2>
      </div>

      <div class="password-content">
        <v-card class="password-change-card">
          <v-card-title class="card-title">
            <v-icon class="mr-3">mdi-lock-reset</v-icon>
            <span>新しいパスワードの設定</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <!-- 現在のパスワード -->
              <v-text-field
                v-model="currentPassword"
                :rules="[rules.required]"
                label="現在のパスワード"
                type="password"
                prepend-icon="mdi-lock"
                required
              ></v-text-field>

              <!-- 新しいパスワード -->
              <v-text-field
                v-model="newPassword"
                :rules="[
                  rules.required,
                  rules.passwordMin,
                  rules.passwordSpecial,
                ]"
                label="新しいパスワード"
                type="password"
                prepend-icon="mdi-lock-plus"
                required
              ></v-text-field>

              <!-- 新しいパスワード確認 -->
              <v-text-field
                v-model="confirmNewPassword"
                :rules="[rules.required, rules.matchNewPassword]"
                label="新しいパスワード(再入力)"
                type="password"
                prepend-icon="mdi-lock-check"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn
              :disabled="!valid || loading"
              :loading="loading"
              @click="changePassword"
              color="primary"
              class="btn-rounded"
            >
              パスワードを変更
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn text @click="goBack" class="btn-rounded">
              戻る
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- パスワード要件の説明 -->
        <div class="info-section">
          <div class="info-card">
            <div class="info-header">
              <v-icon class="info-icon">mdi-information</v-icon>
              <h3>パスワード要件</h3>
            </div>
            <div class="info-content">
              <div class="requirement-item">
                <v-icon small color="success">mdi-check-circle</v-icon>
                <span>8文字以上で入力してください</span>
              </div>
              <div class="requirement-item">
                <v-icon small color="success">mdi-check-circle</v-icon>
                <span>英数字と特殊文字のみ使用可能</span>
              </div>
              <div class="requirement-item">
                <v-icon small color="info">mdi-security</v-icon>
                <span>セキュリティのため、定期的な変更を推奨します</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功メッセージのスナックバー -->
    <v-snackbar
      v-model="successSnackbar"
      color="success"
      timeout="3000"
    >
      パスワードが正常に変更されました
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="successSnackbar = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>

    <!-- エラーメッセージのスナックバー -->
    <v-snackbar
      v-model="errorSnackbar"
      color="error"
      timeout="5000"
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="errorSnackbar = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
import apiFacade from "../services/apiFacade";

export default {
  name: "PasswordChange",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      valid: false,
      loading: false,
      successSnackbar: false,
      errorSnackbar: false,
      errorMessage: "",
      rules: {
        required: (value) => !!value || "必須項目です。",
        passwordMin: (v) =>
          (v && v.length >= 8) ||
          "パスワードは最低8文字以上で入力してください。",
        passwordSpecial: (v) =>
          /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]+$/.test(v) ||
          "パスワードは英数字と特殊文字のみ使用可能です。",
        matchNewPassword: (v) =>
          v === this.newPassword || "パスワードが一致しません。",
      },
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async changePassword() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.loading = true;
      try {
        await apiFacade.changePassword(
          this.currentPassword,
          this.newPassword
        );
        
        // 成功時の処理
        this.successSnackbar = true;
        this.resetForm();
      } catch (error) {
        console.error("Password change error:", error);
        this.errorMessage = error.message || "パスワードの変更に失敗しました。";
        this.errorSnackbar = true;
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmNewPassword = "";
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
  },
};
</script>

<style scoped>
.content-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.password-header {
  text-align: center;
  margin-bottom: 32px;
}

.password-header h2 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.password-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.password-change-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-title {
  background: linear-gradient(135deg, #00bfa5 0%, #00acc1 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 20px 24px;
}

.card-title .v-icon {
  color: white;
}

.btn-rounded {
  border-radius: 25px;
  text-transform: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.btn-rounded:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.info-section {
  margin-top: 16px;
}

.info-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.info-icon {
  color: #00bfa5;
  margin-right: 12px;
  font-size: 24px;
}

.info-header h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.requirement-item span {
  color: #555;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .content-container {
    padding: 16px;
  }
  
  .password-header h2 {
    font-size: 1.5rem;
  }
  
  .info-card {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .password-header h2 {
    font-size: 1.3rem;
  }
  
  .card-title {
    padding: 16px 20px;
  }
  
  .requirement-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>