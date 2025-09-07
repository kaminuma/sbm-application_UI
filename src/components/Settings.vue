<template>
  <v-main>
    <div class="content-container">
      <div class="settings-header">
        <h2>⚙️ 設定</h2>
      </div>

      <div class="settings-content">
        <!-- ユーザー情報セクション -->
        <v-card class="settings-card mb-6" elevation="3">
          <v-card-title class="card-title d-flex align-center justify-space-between py-4">
            <div class="d-flex align-center">
            <v-avatar color="primary" size="40" class="mr-4">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <div>
              <h3 class="mb-0">プロフィール</h3>
              <span class="subtitle">アカウント情報とプロフィール画像</span>
            </div>
            </div>
            <!-- ログアウトボタン -->
            <v-btn
              @click="confirmLogout"
              color="white"
              variant="outlined"
              size="small"
              :loading="logoutLoading"
              prepend-icon="mdi-logout"
            >
              ログアウト
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-6">
            <!-- プロフィール画像セクション -->
            <div class="profile-image-section mb-6">
              <div class="section-title mb-4">
                <v-icon color="primary" class="mr-2">mdi-image-area</v-icon>
                <span class="section-label">プロフィール画像</span>
              </div>
              
              <div class="profile-image-container-new">
                <!-- 画像プレビューとボタンを統合 -->
                <div class="profile-image-card">
                  <div class="image-preview-new">
                    <v-avatar size="80" class="profile-avatar-new">
                      <img 
                        v-if="!profileImageInfo?.profile_image_url"
                        src="/default-avatar.svg"
                        alt="Default Profile"
                        class="profile-image"
                      />
                      <img 
                        v-else
                        :src="imageDataUrl"
                        :key="imageKey"
                        alt="Profile"
                        class="profile-image"
                        @error="handleImageError"
                      />
                    </v-avatar>
                    <div v-if="profileImageInfo?.is_google_image" class="google-badge-new">
                      <v-chip size="x-small" color="primary">
                        <v-icon size="10" class="mr-1">mdi-google</v-icon>
                        Google
                      </v-chip>
                    </div>
                  </div>

                  <div class="image-actions-new">
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      @change="handleFileSelect"
                      style="display: none"
                    />
                    
                    <div class="action-buttons">
                      <v-btn
                        @click="$refs.fileInput.click()"
                        :loading="uploading"
                        :disabled="uploading"
                        color="primary"
                        variant="outlined"
                        size="small"
                        class="action-btn"
                      >
                        <v-icon class="mr-1" size="16">mdi-upload</v-icon>
                        {{ profileImageInfo?.profile_image_url ? '変更' : 'アップロード' }}
                      </v-btn>

                      <v-btn
                        v-if="profileImageInfo?.can_delete"
                        @click="confirmImageDelete"
                        :loading="deleting"
                        :disabled="deleting || uploading"
                        color="error"
                        variant="text"
                        size="small"
                        class="action-btn"
                      >
                        <v-icon class="mr-1" size="16">mdi-delete</v-icon>
                        削除
                      </v-btn>
                    </div>

                    <div class="image-info-new">
                      <v-chip size="x-small" variant="tonal" color="info" class="format-chip">
                        JPEG, PNG, WebP (最大5MB)
                      </v-chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- ユーザー情報 -->
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

    <!-- 画像削除確認ダイアログ -->
    <v-dialog v-model="imageDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          プロフィール画像の削除
        </v-card-title>
        <v-card-text>
          <div v-if="profileImageInfo?.is_google_image">
            Googleアカウントの画像を削除しますか？
            <br>
            再ログイン時に復元される可能性があります。
          </div>
          <div v-else>
            プロフィール画像を削除してもよろしいですか？
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="imageDeleteDialog = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="deleteProfileImage"
          >
            削除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ログアウト確認ダイアログ -->
    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 d-flex align-center">
          <v-icon color="warning" class="mr-2">mdi-logout</v-icon>
          ログアウト確認
        </v-card-title>
        <v-card-text>
          <div class="text-body-1">
            ログアウトしてもよろしいですか？
            <br>
            再度ログインするには認証情報の入力が必要です。
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="logoutDialog = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="warning"
            variant="text"
            @click="executeLogout"
            :loading="logoutLoading"
          >
            ログアウト
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      
      // プロフィール画像
      profileImageInfo: null,
      uploading: false,
      deleting: false,
      imageDeleteDialog: false,
      imageKey: Date.now(), // 画像キャッシュバスティング用
      imageDataUrl: null, // Base64エンコードされた画像データ
      
      // パスワード変更
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      passwordValid: false,
      passwordLoading: false,
      
      // ログアウト処理
      logoutDialog: false,
      logoutLoading: false,
      
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
    this.fetchProfileImage();
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

    // プロフィール画像関連メソッド
    async fetchProfileImage() {
      try {
        console.log('Fetching profile image...');
        const response = await apiFacade.getProfileImage();
        console.log('Profile image response:', response);
        
        if (response.success) {
          this.profileImageInfo = response.data;
          console.log('Profile image info updated:', this.profileImageInfo);
          this.imageKey = Date.now(); // データ取得時もキャッシュバスティング
          
          // 画像URLが存在する場合、認証付きでフェッチしてBase64に変換
          if (response.data.profile_image_url) {
            await this.loadImageWithAuth(response.data.profile_image_url);
          } else {
            this.imageDataUrl = null;
          }
        } else {
          console.error('Failed to fetch profile image:', response.error);
        }
      } catch (error) {
        console.error('Failed to fetch profile image:', error);
      }
    },

    // 認証付きで画像を読み込んでBase64に変換
    async loadImageWithAuth(imageUrl) {
      try {
        console.log('Loading image with auth:', imageUrl);
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await fetch(imageUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          
          reader.onload = (e) => {
            this.imageDataUrl = e.target.result;
            console.log('Image loaded and converted to data URL');
          };
          
          reader.readAsDataURL(blob);
        } else {
          console.error('Failed to fetch image:', response.status, response.statusText);
          this.imageDataUrl = null;
        }
      } catch (error) {
        console.error('Error loading image with auth:', error);
        this.imageDataUrl = null;
      }
    },

    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      // クライアント側バリデーション
      if (file.size > 5 * 1024 * 1024) {
        this.showError('ファイルサイズは5MB以下にしてください');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.showError('対応していないファイル形式です。JPEG、PNG、WebPのみ対応しています');
        return;
      }

      this.uploadProfileImage(file);
    },

    async uploadProfileImage(file) {
      this.uploading = true;
      try {
        const response = await apiFacade.uploadProfileImage(file);
        
        if (response.success) {
          this.profileImageInfo = response.data;
          this.imageKey = Date.now(); // キャッシュバスティングで画像を強制更新
          console.log('Profile image updated:', response.data);
          this.showSuccess(response.data.message || 'プロフィール画像をアップロードしました');
          
          // アップロード成功時は画像を即座に認証付きで読み込み
          if (response.data.profile_image_url) {
            await this.loadImageWithAuth(response.data.profile_image_url);
          }
          
          // ヘッダーにプロフィール画像更新を通知
          this.$root.$emit('profile-image-updated');
        } else {
          this.showError(response.error || 'アップロードに失敗しました');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        this.showError('アップロードに失敗しました');
      } finally {
        this.uploading = false;
        // ファイル入力をクリア
        this.$refs.fileInput.value = '';
      }
    },

    confirmImageDelete() {
      this.imageDeleteDialog = true;
    },

    async deleteProfileImage() {
      this.imageDeleteDialog = false;
      this.deleting = true;
      
      try {
        const response = await apiFacade.deleteProfileImage();
        
        if (response.success) {
          this.profileImageInfo = response.data;
          this.imageKey = Date.now(); // キャッシュバスティングで画像を強制更新
          this.imageDataUrl = null; // 削除時は画像データURLをクリア
          console.log('Profile image deleted:', response.data);
          this.showSuccess(response.data.message || 'プロフィール画像を削除しました');
          
          // ヘッダーにプロフィール画像更新を通知
          this.$root.$emit('profile-image-updated');
        } else {
          this.showError(response.error || '削除に失敗しました');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        this.showError('削除に失敗しました');
      } finally {
        this.deleting = false;
      }
    },

    handleImageError(event) {
      console.error('Image load error:', event);
      console.error('Failed to load image URL:', event.target.src);
      console.error('imageDataUrl value:', this.imageDataUrl);
      console.error('profileImageInfo:', this.profileImageInfo);
      event.target.src = '/default-avatar.svg';
    },

    showSuccess(message) {
      this.successMessage = message;
      this.successSnackbar = true;
    },

    showError(message) {
      this.errorMessage = message;
      this.errorSnackbar = true;
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
    
    // ログアウト関連メソッド
    confirmLogout() {
      this.logoutDialog = true;
    },
    
    async executeLogout() {
      this.logoutLoading = true;
      try {
        // Vuexのlogoutアクションを呼び出し
        await this.$store.dispatch('logout');
        
        this.logoutDialog = false;
        this.showSuccess('ログアウトしました');
        
        // 少し遅延してからリダイレクト
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);
        
      } catch (error) {
        console.error('ログアウトエラー:', error);
        this.showError('ログアウト処理に失敗しました');
      } finally {
        this.logoutLoading = false;
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
        await apiFacade.withdrawAccount();
        
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

/* プロフィール画像セクションのスタイル */
.profile-image-section {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #333;
}

.section-label {
  font-size: 1.1rem;
  font-weight: 600;
}

.profile-image-container-new {
  width: 100%;
}

.profile-image-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 191, 165, 0.1);
  transition: all 0.3s ease;
}

.profile-image-card:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 191, 165, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-preview-new {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar-new {
  border: 3px solid rgba(var(--v-theme-primary), 0.1);
  transition: border-color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-avatar-new:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.google-badge-new {
  position: absolute;
  bottom: -3px;
  right: -3px;
}

.image-actions-new {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
}

.image-info-new {
  margin-top: 8px;
}

.format-chip {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .profile-image-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 16px;
  }

  .image-actions-new {
    width: 100%;
    align-items: center;
  }

  .action-buttons {
    justify-content: center;
    width: 100%;
  }

  .action-btn {
    min-width: 100px;
  }

  .profile-avatar-new {
    width: 70px !important;
    height: 70px !important;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    min-width: auto;
  }
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