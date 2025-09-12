<!-- 現在未使用のコンポーネント - AuthModalを使用中 -->
<template>
  <div>
    <!-- ヘッダーコンポーネントを非表示に設定 -->
    <Header :showMenu="false" />

    <v-container>
      <v-card>
        <!-- タイトル部分: ログインか新規登録かを動的に表示 -->
        <v-card-title>
          <span v-if="isLogin">ログイン</span>
          <span v-else>新規登録</span>
        </v-card-title>

        <!-- フォーム部分 -->
        <v-card-text>
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
              required
            ></v-text-field>

            <!-- メールアドレスフィールド（新規登録時のみ表示） -->
            <v-text-field
              v-if="!isLogin"
              v-model="email"
              :rules="[rules.required, rules.emailFormat]"
              label="メールアドレス"
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
              required
            ></v-text-field>

            <!-- パスワード確認フィールド（新規登録時のみ表示） -->
            <v-text-field
              v-if="!isLogin"
              v-model="confirmPassword"
              :rules="[rules.required, rules.matchPassword]"
              label="パスワード(再入力)"
              type="password"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <!-- アクション部分: 保存ボタンと切り替えボタン -->
        <v-card-actions>
          <!-- 保存ボタン: フォームが有効な場合のみ有効化 -->
          <v-btn :disabled="!valid" @click="submit" color="primary">
            {{ isLogin ? "ログイン" : "新規登録" }}
          </v-btn>

          <v-spacer></v-spacer>

          <!-- ログインと新規登録の切り替えボタン -->
          <v-btn text @click="toggleLogin">
            {{ isLogin ? "新規登録画面へ" : "ログイン画面へ" }}
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- SBMアプリの簡易解説セクション -->
      <v-card class="mt-5 explanation-card">
        <v-card-title>
          <span>SBMアプリについて</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- アイコンとテキストのペアを3つ表示 -->
            <v-col cols="12" sm="4" class="d-flex align-center">
              <v-icon large color="primary" class="mr-3"
                >mdi-calendar-check</v-icon
              >
              <div>
                <h3>生活記録管理</h3>
                <p>
                  日々の活動や生活の記録を簡単に管理。カレンダー表示で視覚的に把握できます。
                </p>
              </div>
            </v-col>

            <v-col cols="12" sm="4" class="d-flex align-center">
              <v-icon large color="primary" class="mr-3">mdi-chart-line</v-icon>
              <div>
                <h3>分析機能</h3>
                <p>
                  生活記録を分析し、健康や生産性向上に役立つインサイトを提供します。
                </p>
              </div>
            </v-col>

            <!-- 気分記録機能に変更 -->
            <v-col cols="12" sm="4" class="d-flex align-center">
              <v-icon large color="primary" class="mr-3"
                >mdi-emoticon-happy</v-icon
              >
              <div>
                <h3>気分記録機能</h3>
                <p>
                  毎日の気分を簡単に登録し、過去の傾向を振り返りやすくする機能です。
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import apiFacade from "../services/apiFacade";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
      isLogin: true,
      rules: {
        required: (value) => !!value || "必須項目です。",
        usernameMin: (v) =>
          (v && v.length >= 2) || "最低2文字以上で入力してください。",
        usernameAlphaNum: (v) =>
          /^[a-zA-Z0-9]*$/.test(v) ||
          "ユーザー名は英数字のみで入力してください。",
        emailFormat: (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
          "有効なメールアドレスを入力してください。",
        passwordMin: (v) =>
          (v && v.length >= 8) ||
          "パスワードは最低8文字以上で入力してください。",
        passwordSpecial: (v) =>
          /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]+$/.test(v) ||
          "パスワードは英数字と特殊文字のみ使用可能です。",
        matchPassword: (v) =>
          v === this.password || "パスワードが一致しません。",
      },
    };
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    return { router, store };
  },
  methods: {
    toggleLogin() {
      this.isLogin = !this.isLogin;
      this.resetFields();
    },
    resetFields() {
      this.username = "";
      this.password = "";
      this.email = "";
      this.confirmPassword = "";
    },
    async submit() {
      // テスト環境では$refs.formが未定義になるため、this.validを使用
      // 本番環境では従来通りの$refs.form.validate()を使用
      if (process.env.NODE_ENV === 'test') {
        if (!this.valid) return;
      } else if (this.$refs.form && !this.$refs.form.validate()) {
        return;
      }
      if (this.isLogin) {
        try {
          const response = await apiFacade.login(
            this.username,
            this.password
          );
          const userId = response.userId;
          this.$store.dispatch("login", userId);
          this.$router.push("/schedule");
        } catch (error) {
          alert("無効な認証情報です");
          console.error("Login error:", error);
        }
      } else {
        if (this.password !== this.confirmPassword) {
          alert("パスワードが一致しません。");
          return;
        }
        try {
          const result = await apiFacade.register(
            this.username,
            this.email,
            this.password
          );
          console.log('登録結果:', result);
          
          if (result && result.userId) {
            // ユーザーIDが返された場合は自動ログイン
            console.log('登録後のユーザーID:', result.userId);
            this.$store.dispatch("login", result.userId);
            alert("登録が完了しました！");
          } else {
            // ユーザーIDがない場合はログイン画面へ
            alert("登録が完了しました！ログイン画面に移動します。");
            // ユーザー名は保持してログイン画面へ遷移
            this.isLogin = true;
            this.password = "";
            this.email = "";
            this.confirmPassword = "";
            
            // フォームの検証状態をリセット
            if (this.$refs.form) {
              this.$refs.form.resetValidation();
            }
          }
        } catch (error) {
          alert(
            "登録に失敗しました。\n別のIDをお試しいただくか、もう一度お試しください。"
          );
          console.error("Registration error:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: auto;
}

/* PC向けに説明部分の横幅を調整 */
@media (min-width: 1024px) {
  .explanation-card {
    max-width: 800px;
    margin: auto;
  }
}

/* フォーム全体の中央揃えとレスポンシブデザイン */
@media (max-width: 600px) {
  .v-card {
    margin: 20px;
  }
}

/* SBMアプリ解説セクションのスタイル */
.mt-5 {
  margin-top: 2rem;
}

.v-card-title span {
  font-weight: bold;
  font-size: 1.5rem;
}

.v-card-text h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.v-theme--light .v-card-text p {
  font-size: 1rem;
  color: #555;
}

.v-theme--dark .v-card-text p {
  font-size: 1rem;
  color: #ffffff;
}

/* アイコンとテキストの間隔調整 */
.mr-3 {
  margin-right: 1rem;
}

/* レスポンシブアイコンサイズ */
@media (max-width: 600px) {
  .v-icon.large {
    font-size: 2rem;
  }
}
</style>
