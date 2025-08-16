<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="animated-bg"></div>
      <v-container>
        <v-row justify="center" align="center" class="hero-content">
          <v-col cols="12" md="10" lg="8" class="text-center">
            <h1 class="hero-title">SBM<span class="highlight">アプリ</span></h1>
            <p class="hero-subtitle">
              生活記録と分析で、より良い毎日を
            </p>
            <p class="hero-description">
              日々の活動、気分、スケジュールを簡単に記録し、
              データ分析で健康と生産性の向上をサポートします。
            </p>
            <div class="hero-actions">
              <v-btn
                color="primary"
                size="large"
                elevation="4"
                @click="showAuthModal('signup')"
                class="action-btn"
              >
                <span class="btn-content">
                  <v-icon class="mr-2">mdi-rocket-launch</v-icon>
                  <span>無料で始める</span>
                </span>
              </v-btn>
              <v-btn
                variant="outlined"
                color="white"
                size="large"
                @click="showAuthModal('login')"
                class="login-btn action-btn"
              >
                <span class="btn-content">
                  <v-icon class="mr-2">mdi-login</v-icon>
                  <span>ログイン</span>
                </span>
              </v-btn>
            </div>

            <!-- Googleログインボタン -->
            <div class="google-section">
              <button
                @click="handleGoogleLogin"
                class="google-login-btn"
              >
                <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span class="google-text">Googleでログイン</span>
              </button>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <v-container>
        <v-row justify="center" class="mb-8">
          <v-col cols="12" class="text-center">
            <h2 class="features-title">主な機能</h2>
            <p class="features-subtitle">
              SBMアプリで実現できることをご紹介します
            </p>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col
            v-for="feature in features"
            :key="feature.title"
            cols="12"
            sm="6"
            md="4"
            class="mb-4"
          >
            <v-card class="feature-card h-100" elevation="2">
              <v-card-text class="text-center pa-6">
                <v-icon
                  :icon="feature.icon"
                  size="48"
                  color="primary"
                  class="mb-4"
                ></v-icon>
                <h3 class="feature-title mb-3">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Second Image Section -->
    <section class="second-image-section">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" order="2" order-md="1">
            <div class="text-content">
              <h2 class="section-title">より良い生活習慣のために</h2>
              <p class="section-description">
                SBMアプリは生活記録を視覚化し、あなたの健康的な生活習慣を
                サポートします。日々のデータから得られる洞察で、
                より良いセルフマネジメントを実現しましょう。
              </p>
              <div class="feature-points">
                <div class="feature-point">
                  <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                  <span>シンプルな操作で簡単記録</span>
                </div>
                <div class="feature-point">
                  <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                  <span>データに基づく生活改善</span>
                </div>
                <div class="feature-point">
                  <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                  <span>カスタマイズ可能なレポート</span>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" order="1" order-md="2">
                <v-img
                  src="/images/image.png"
                  alt="生活記録 生活管理 健康管理 記録アプリ 日記 スケジュール管理 分析 グラフ カレンダー"
                  class="second-demo-image"
                ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="cta-title">今すぐ始めましょう</h2>
            <p class="cta-description">
              無料でアカウントを作成して、より良い生活習慣を築きませんか？
            </p>
            <v-btn
              color="primary"
              size="large"
              class="mt-4 action-btn"
              @click="showAuthModal('signup')"
            >
              <span class="btn-content">
                <v-icon class="mr-2">mdi-account-plus</v-icon>
                <span>無料アカウント作成</span>
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>
    
    <!-- Footer Section -->
    <section class="footer-section">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <div class="mb-4">
              <router-link to="/terms" class="footer-link">利用規約</router-link>
              <router-link to="/privacy" class="footer-link">プライバシーポリシー</router-link>
              <a href="https://x.com/kaminuma_dev" target="_blank" rel="noopener" class="footer-link">
                <v-icon size="18" class="mr-1">mdi-twitter</v-icon>お問い合わせ
              </a>
            </div>
            <p class="footer-copyright">
              &copy; {{ new Date().getFullYear() }} SBMアプリ All Rights Reserved.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>
    
    <!-- Authentication Modal -->
    <AuthModal
      v-model="showModal"
      :default-mode="authMode"
      @success="onAuthSuccess"
      @close="onModalClose"
      :redirect-path="redirectAfterAuth"
    />
  </div>
</template>

<script>
import AuthModal from './AuthModal.vue';

export default {
  name: 'LandingPage',
  components: {
    AuthModal
  },
  data() {
    return {
      features: [
        {
          icon: 'mdi-calendar-check',
          title: '生活記録管理',
          description: '日々の活動や生活の記録を簡単に管理。カレンダー表示で視覚的に把握できます。'
        },
        {
          icon: 'mdi-chart-line',
          title: '分析機能',
          description: '生活記録を分析し、健康や生産性向上に役立つインサイトを提供します。'
        },
        {
          icon: 'mdi-emoticon-happy',
          title: '気分記録機能',
          description: '毎日の気分を簡単に登録し、過去の傾向を振り返りやすくする機能です。'
        },
        {
          icon: 'mdi-bell-outline',
          title: 'リマインダー',
          description: '重要なタスクや記録の入力を忘れないよう、リマインダーを設定できます。'
        },
        {
          icon: 'mdi-lock-outline',
          title: 'セキュアな保存',
          description: 'あなたのデータはセキュアに保存され、いつでも安全にアクセスできます。'
        },
        {
          icon: 'mdi-cellphone-link',
          title: 'マルチデバイス対応',
          description: 'スマートフォン、タブレット、PCなど様々な端末から利用可能です。'
        }
      ],
      // 認証モーダル関連
      showModal: false,
      authMode: 'login',
      redirectAfterAuth: '/schedule'
    }
  },
  created() {
    // URLクエリから指定されたリダイレクト先があれば保存
    if (this.$route.query.redirect) {
      this.redirectAfterAuth = this.$route.query.redirect;
    }
  },
  methods: {
    showAuthModal(mode) {
      this.authMode = mode;
      this.showModal = true;
    },
    onAuthSuccess({ isLogin }) {
      console.log(`${isLogin ? 'ログイン' : '新規登録'}が成功しました`);
      // 認証成功後の追加処理があれば実装
    },
    onModalClose() {
      this.showModal = false;
    },
    handleGoogleLogin() {
      const oauthBaseUrl = import.meta.env.VITE_OAUTH2_BASE_URL;
      window.location.href = `${oauthBaseUrl}/oauth2/authorization/google`;
    }
  }
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  overflow-x: hidden;
  font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
}

.highlight {
  color: #d63aff;
  position: relative;
  text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.7);
  font-weight: 900;
  letter-spacing: -0.5px;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 70%, rgba(214, 58, 255, 0.5) 0%, rgba(50, 81, 200, 0) 35%),
              radial-gradient(circle at 70% 30%, rgba(50, 81, 200, 0.5) 0%, rgba(214, 58, 255, 0) 35%),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 40%);
  filter: blur(35px);
  opacity: 0.7;
  animation: pulse 10s infinite alternate;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
    filter: blur(35px);
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    filter: blur(40px);
    transform: scale(1.05);
  }
  100% {
    opacity: 0.6;
    filter: blur(45px);
    transform: scale(1);
  }
}

.login-btn {
  border: 2px solid white !important;
  color: white !important;
}

.login-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.action-btn {
  min-width: 180px !important;
  font-weight: 700 !important;
  letter-spacing: 0.3px !important;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.demo-image {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 100%;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #3251c8 0%, #d63aff 100%);
  color: white;
  padding: 100px 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjkwMCIgdmlld0JveD0iMCAwIDE0NDAgOTAwIj48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIgZD0iTTE0MTguMSAwSDIxLjlDOS41IDAgMCA5LjUgMCAyMS45VjkwMGg5MDBsMjAuNS0yMC41TDE0NDAuMSAzMDBWMjEuOWMwLTEyLjQtOS41LTIxLjktMjItMjEuOXoiLz48L3N2Zz4=') no-repeat;
  background-size: cover;
  opacity: 0.1;
}

.hero-content {
  min-height: 450px;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -1px;
  background: linear-gradient(to right, #ffffff, #f0f0ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 15px rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
}

.hero-subtitle {
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 1.8rem;
  opacity: 0.95;
  letter-spacing: 0.5px;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.85;
  line-height: 1.7;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.hero-actions .v-btn {
  border-radius: 50px;
  min-width: 160px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.hero-actions .v-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

/* Features Section */
.features-section {
  padding: 100px 0;
  background-color: #f8f9fa;
  position: relative;
}

.features-section::before {
  content: "";
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  height: 80px;
  background: #f8f9fa;
  clip-path: ellipse(70% 80px at 50% 80px);
}

.features-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.features-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: linear-gradient(90deg, #3251c8, #d63aff);
  border-radius: 3px;
  box-shadow: 0 2px 10px rgba(214, 58, 255, 0.3);
}

.features-subtitle {
  font-size: 1.3rem;
  color: #4a5568;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.feature-card {
  transition: all 0.4s ease;
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05) !important;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 35px rgba(50, 81, 200, 0.15) !important;
  border-color: rgba(214, 58, 255, 0.1);
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a365d;
  margin-top: 0.5rem;
}

.feature-description {
  color: #4a5568;
  line-height: 1.7;
  font-size: 1.05rem;
  margin-top: 0.75rem;
}

/* Call to Action Section */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #3251c8 0%, #d63aff 100%);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15);
}

.cta-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjkwMCIgdmlld0JveD0iMCAwIDE0NDAgOTAwIj48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIgZD0iTTE0MTguMSAwSDIxLjlDOS41IDAgMCA5LjUgMCAyMS45VjkwMGg5MDBsMjAuNS0yMC41TDE0NDAuMSAzMDBWMjEuOWMwLTEyLjQtOS41LTIxLjktMjItMjEuOXoiLz48L3N2Zz4=') no-repeat;
  background-size: cover;
  opacity: 0.1;
  transform: rotate(180deg);
}

.cta-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

.cta-description {
  font-size: 1.3rem;
  opacity: 0.95;
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-section .v-btn {
  border-radius: 50px;
  min-width: 200px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
  background: white !important;
  color: #4568dc !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.cta-section .v-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-title {
    font-size: 3.2rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .hero-description {
    font-size: 1.15rem;
  }
  
  .features-title,
  .cta-title {
    font-size: 2.4rem;
  }
  
  .features-subtitle,
  .cta-description {
    font-size: 1.2rem;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 70px 0;
    min-height: auto;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 1.2rem;
  }
  
  .hero-description {
    font-size: 1.05rem;
    margin-bottom: 2rem;
  }
  
  .features-section,
  .second-image-section,
  .cta-section {
    padding: 70px 0;
  }
  
  .features-title,
  .section-title,
  .cta-title {
    font-size: 2rem;
  }
  
  .features-subtitle,
  .section-description,
  .cta-description {
    font-size: 1.1rem;
  }
  
  .feature-point {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-actions .v-btn {
    width: 100%;
    margin: 0.5rem 0;
  }
  
  .footer-link {
    display: block;
    margin: 10px 0;
  }
}

/* Second Image Section */
.second-image-section {
  padding: 100px 0;
  background-color: white;
}

.second-demo-image {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(50, 81, 200, 0.15);
  border: 2px solid rgba(214, 58, 255, 0.1);
  transition: all 0.4s ease;
  transform: perspective(1000px) rotateY(-2deg);
}

.second-demo-image:hover {
  transform: perspective(1000px) rotateY(0deg) translateY(-5px);
  box-shadow: 0 25px 50px rgba(50, 81, 200, 0.25);
}

.section-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1.5rem;
  position: relative;
}

.section-description {
  font-size: 1.2rem;
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.feature-points {
  margin-top: 2rem;
}

.feature-point {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #2d3748;
}

/* Footer Section */
.footer-section {
  background-color: #1a202c;
  color: white;
  padding: 50px 0 40px;
  position: relative;
}

.footer-section::before {
  content: "";
  position: absolute;
  top: -30px;
  left: 0;
  right: 0;
  height: 30px;
  background: #1a202c;
  clip-path: ellipse(70% 30px at 50% 0);
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  margin: 0 15px;
  padding: 5px 0;
  font-size: 0.95rem;
  position: relative;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: white;
}

.footer-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: white;
  transition: width 0.3s ease;
}

.footer-link:hover::after {
  width: 100%;
}

.footer-copyright {
  margin-top: 20px;
  font-size: 0.85rem;
  opacity: 0.7;
}

.footer-link {
  color: #cbd5e0;
  text-decoration: none;
  margin: 0 15px;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  position: relative;
  display: inline-block;
  padding: 5px 0;
}

.footer-link:hover {
  color: white;
}

.footer-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #4568dc, #b06ab3);
  transition: width 0.3s ease;
}

.footer-link:hover::after {
  width: 100%;
}

.footer-copyright {
  color: #a0aec0;
  font-size: 0.9rem;
  margin-top: 20px;
}

/* Utility classes */
.h-100 {
  height: 100%;
}

/* Googleログインセクション */
.google-section {
  margin-top: 24px;
  width: 100%;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Googleログインボタン */
.google-login-btn {
  width: 100%;
  min-width: 180px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #3c4043;
  text-decoration: none;
  padding: 0 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.3px;
}

.google-login-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.google-login-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.google-login-btn:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1), 0 8px 20px rgba(0, 0, 0, 0.15);
}

.google-icon {
  margin-right: 12px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.google-text {
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* レスポンシブ調整 */
@media (max-width: 600px) {
  .google-section {
    margin-top: 24px;
    max-width: 100%;
    padding: 0 20px;
  }
  
  .google-login-btn {
    height: 48px;
    font-size: 14px;
  }
}
</style>