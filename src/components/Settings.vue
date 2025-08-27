<template>
  <v-main>
    <div class="content-container">
      <div class="settings-header">
        <h2>⚙️ 設定</h2>
      </div>

      <div class="settings-content">
        <!-- ユーザー情報セクション -->
        <v-card class="settings-card mb-6" elevation="3">
          <v-card-title class="card-title d-flex align-center py-4">
            <v-avatar color="primary" size="40" class="mr-4">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <div>
              <h3 class="mb-0">プロフィール</h3>
              <span class="subtitle">アカウント情報</span>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-6">
            <div class="info-container">
              <div class="info-section">
                <div class="info-icon-wrapper">
                  <v-icon color="primary">mdi-identifier</v-icon>
                </div>
                <div class="info-content">
                  <div class="info-label">ユーザーID</div>
                  <div class="info-value">{{ userId }}</div>
                </div>
              </div>
              
              <div class="info-section">
                <div class="info-icon-wrapper">
                  <v-icon color="primary">mdi-account-circle</v-icon>
                </div>
                <div class="info-content">
                  <div class="info-label">ユーザー名</div>
                  <div class="info-value">{{ username }}</div>
                </div>
              </div>
              
              <div class="info-section">
                <div class="info-icon-wrapper">
                  <v-icon color="primary">mdi-email</v-icon>
                </div>
                <div class="info-content">
                  <div class="info-label">登録メールアドレス</div>
                  <div class="info-value">{{ email }}</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- パスワード変更セクション（OAuthユーザー以外のみ表示） -->
        <v-card v-if="!isOAuthUser" class="settings-card mb-6" elevation="3">
          <v-card-title class="card-title d-flex align-center py-4">
            <v-avatar color="orange" size="40" class="mr-4">
              <v-icon color="white">mdi-lock-reset</v-icon>
            </v-avatar>
            <div>
              <h3 class="mb-0">セキュリティ</h3>
              <span class="subtitle">パスワード変更</span>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-6">
            <v-form ref="passwordForm" v-model="passwordValid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="currentPassword"
                    :rules="[rules.required]"
                    label="現在のパスワード"
                    type="password"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="newPassword"
                    :rules="[
                      rules.required,
                      rules.passwordMin,
                      rules.passwordSpecial,
                    ]"
                    label="新しいパスワード"
                    type="password"
                    prepend-inner-icon="mdi-lock-plus"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="confirmNewPassword"
                    :rules="[rules.required, rules.matchNewPassword]"
                    label="パスワード確認"
                    type="password"
                    prepend-inner-icon="mdi-lock-check"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="mb-4"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              
              <!-- パスワード要件 -->
              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
                density="compact"
              >
                <div class="text-body-2">
                  <strong>パスワード要件:</strong>
                  <ul class="ml-4 mt-2">
                    <li>8文字以上</li>
                    <li>英数字と特殊文字のみ使用可能</li>
                  </ul>
                </div>
              </v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions class="px-6 pb-6 justify-end">
            <v-btn
              :disabled="!passwordValid || passwordLoading"
              :loading="passwordLoading"
              @click="changePassword"
              color="primary"
              variant="elevated"
              size="large"
              class="modern-btn"
            >
              <v-icon left>mdi-content-save</v-icon>
              パスワードを更新
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- アカウント管理セクション -->
        <v-card class="settings-card danger-zone" elevation="3">
          <v-card-title class="card-title danger-title d-flex align-center py-4">
            <v-avatar color="error" size="40" class="mr-4">
              <v-icon color="white">mdi-account-remove</v-icon>
            </v-avatar>
            <div>
              <h3 class="mb-0">アカウント管理</h3>
              <span class="subtitle">危険な操作</span>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-6">
            <v-alert
              type="error"
              variant="tonal"
              class="mb-4"
              density="default"
              prominent
            >
              <div class="text-body-1">
                <strong>重要な注意事項</strong>
                <div class="mt-2">
                  退会するとアカウントが無効化され、ログインできなくなります。<br>
                  この操作は取り消すことができません。
                </div>
                <ul class="ml-4 mt-3">
                  <li>アカウントへのアクセスができなくなります</li>
                  <li>データは一定期間保持後、削除される場合があります</li>
                  <li>退会後の復元は原則できません</li>
                </ul>
              </div>
            </v-alert>
          </v-card-text>
          <v-card-actions class="px-6 pb-6 justify-end">
            <v-btn
              @click="openWithdrawDialog"
              color="error"
              variant="elevated"
              size="large"
              class="modern-btn"
              prepend-icon="mdi-account-remove"
            >
              退会する
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <!-- 退会確認ダイアログ -->
    <v-dialog v-model="withdrawDialog" max-width="600px" persistent>
      <v-card class="modern-dialog" elevation="24">
        <v-card-title class="dialog-title d-flex align-center py-4">
          <v-avatar color="error" size="40" class="mr-4">
            <v-icon color="white">mdi-alert-circle</v-icon>
          </v-avatar>
          <div>
            <h3 class="mb-0">退会の確認</h3>
            <span class="dialog-subtitle">この操作は元に戻せません</span>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        
        <v-card-text class="py-6">
          <div class="withdraw-warning">
            <v-alert
              type="error"
              variant="tonal"
              class="mb-4"
              density="comfortable"
              prominent
            >
              <div class="text-body-1">
                <strong>⚠️ 重要な警告</strong>
                <div class="mt-2">
                  本当に退会しますか？<br>
                  退会すると<strong>アカウントが無効化</strong>され、ログインできなくなります。
                </div>
              </div>
            </v-alert>
            
            <div class="warning-content">
              <p class="text-body-1 mb-3">退会による影響：</p>
              <div class="deletion-list">
                <v-chip
                  class="ma-1"
                  color="warning"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-account-off"
                >
                  アカウントの無効化
                </v-chip>
                <v-chip
                  class="ma-1"
                  color="warning"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-login-variant"
                >
                  ログイン不可
                </v-chip>
                <v-chip
                  class="ma-1"
                  color="warning"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-database-lock"
                >
                  データへのアクセス不可
                </v-chip>
              </div>
              <v-alert
                type="info"
                variant="tonal"
                class="mt-3"
                density="compact"
              >
                <div class="text-caption">
                  ※ データは一定期間保持された後、削除される場合があります
                </div>
              </v-alert>
            </div>
            
            <div class="confirmation-section mt-6">
              <div class="text-body-1 mb-3">
                続行するには「<strong>退会する</strong>」と入力してください：
              </div>
              <v-text-field
                v-model="confirmText"
                label="確認テキストを入力"
                placeholder="退会する"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-keyboard"
                class="confirmation-input"
                @input="validateConfirmText"
                :error="confirmText && !isConfirmTextValid"
                :error-messages="confirmText && !isConfirmTextValid ? 'テキストが正しくありません' : ''"
                hide-details="auto"
              ></v-text-field>
            </div>
          </div>
        </v-card-text>
        
        <v-divider></v-divider>
        <v-card-actions class="px-6 py-4">
          <v-btn
            variant="text"
            size="large"
            @click="closeWithdrawDialog"
            :disabled="withdrawLoading"
            class="mr-2"
          >
            <v-icon left>mdi-arrow-left</v-icon>
            キャンセル
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="elevated"
            size="large"
            @click="executeWithdraw"
            :disabled="!isConfirmTextValid || withdrawLoading"
            :loading="withdrawLoading"
            class="modern-btn"
            prepend-icon="mdi-delete-forever"
          >
            退会を実行
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 成功メッセージのスナックバー -->
    <v-snackbar
      v-model="successSnackbar"
      color="success"
      timeout="3000"
    >
      {{ successMessage }}
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
import { clearAuthToken } from "../services/authUtils";

export default {
  name: "Settings",
  data() {
    return {
      // ユーザー情報
      userId: "",
      username: "",
      email: "",
      isOAuthUser: false,
      
      // パスワード変更
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      passwordValid: false,
      passwordLoading: false,
      
      // 退会処理
      withdrawDialog: false,
      confirmText: "",
      isConfirmTextValid: false,
      withdrawLoading: false,
      
      // 通知
      successSnackbar: false,
      successMessage: "",
      errorSnackbar: false,
      errorMessage: "",
      
      // バリデーションルール
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
  mounted() {
    this.loadUserInfo();
  },
  methods: {
    async loadUserInfo() {
      try {
        // Vuexストアからユーザー情報を取得
        this.userId = this.$store.getters.getUserId || localStorage.getItem("userId") || "";
        
        // 毎回APIからユーザー情報を取得
        const userInfo = await apiFacade.getUserInfo();
        
        this.userId = userInfo.user_id || this.userId;
        this.username = userInfo.username || "ユーザー";
        this.email = userInfo.email || "";
        this.isOAuthUser = userInfo.provider === "GOOGLE" || false;
        
      } catch (error) {
        console.error("ユーザー情報の取得に失敗:", error);
        // APIエラー時のフォールバック
        this.username = "ユーザー";
        this.email = "";
        this.isOAuthUser = false;
      }
    },
    
    async changePassword() {
      if (!this.$refs.passwordForm.validate()) {
        return;
      }

      this.passwordLoading = true;
      try {
        await apiFacade.changePassword(
          this.currentPassword,
          this.newPassword
        );
        
        this.successMessage = "パスワードが正常に変更されました";
        this.successSnackbar = true;
        this.resetPasswordForm();
      } catch (error) {
        this.errorMessage = error.message || "パスワードの変更に失敗しました。";
        this.errorSnackbar = true;
      } finally {
        this.passwordLoading = false;
      }
    },
    
    resetPasswordForm() {
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmNewPassword = "";
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.resetValidation();
      }
    },
    
    openWithdrawDialog() {
      this.withdrawDialog = true;
      this.confirmText = "";
      this.isConfirmTextValid = false;
    },
    
    closeWithdrawDialog() {
      this.withdrawDialog = false;
      this.confirmText = "";
      this.isConfirmTextValid = false;
    },
    
    validateConfirmText() {
      this.isConfirmTextValid = this.confirmText === "退会する";
    },
    
    async executeWithdraw() {
      if (!this.isConfirmTextValid) {
        return;
      }
      
      this.withdrawLoading = true;
      try {
        const response = await apiFacade.withdrawAccount();
        
        // ダイアログを閉じる
        this.closeWithdrawDialog();
        
        // 成功メッセージを表示
        this.successMessage = "退会処理が完了しました。ご利用ありがとうございました。";
        this.successSnackbar = true;
        
        // 少し遅延してからリダイレクト（メッセージを見せるため）
        setTimeout(() => {
          // 認証情報をクリア
          clearAuthToken();
          localStorage.clear();
          
          // Vuexの状態もクリア
          this.$store.dispatch('logout');
          
          // ランディングページへリダイレクト
          this.$router.push("/");
        }, 2000);
        
      } catch (error) {
        console.error("退会処理エラー:", error);
        this.errorMessage = error.message || "退会処理に失敗しました。";
        this.errorSnackbar = true;
        this.closeWithdrawDialog();
      } finally {
        this.withdrawLoading = false;
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

.settings-header {
  text-align: center;
  margin-bottom: 32px;
}

.settings-header h2 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-card {
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

.card-title h3 {
  color: white;
  font-weight: 600;
}

.card-title .subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.danger-zone .danger-title {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
}

.modern-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.modern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 191, 165, 0.1);
  transition: all 0.3s ease;
}

.info-section:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 191, 165, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(0, 191, 165, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}



/* ダイアログスタイル */
.modern-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.dialog-title {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  color: white;
  border-radius: 0;
  padding: 20px 24px;
}

.dialog-title h3 {
  color: white;
  font-weight: 600;
}

.dialog-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
}

.withdraw-warning {
  padding: 0;
}

.warning-content {
  margin: 16px 0;
}

.deletion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.confirmation-section {
  background: rgba(255, 235, 238, 0.5);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.confirmation-input {
  margin-top: 12px;
}

@media (max-width: 768px) {
  .content-container {
    padding: 16px;
  }
  
  .settings-header h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .settings-header h2 {
    font-size: 1.3rem;
  }
  
  .card-title {
    padding: 16px 20px;
  }
}
</style>