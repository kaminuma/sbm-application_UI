<template>
  <div class="privacy-page">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="privacy-title">プライバシーポリシー</h1>
          <div class="privacy-updated-date">最終更新日: 2025年8月30日</div>
          
          <div class="privacy-section">
            <p class="mb-5">
              SBM Application（以下「当アプリ」といいます）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。本ポリシーは、Google Play Store のデータ安全性要件に準拠し、ユーザーの皆様に透明性の高い情報を提供します。
            </p>
            
            <h2 class="privacy-section-title">1. 収集するデータの種類</h2>
            <p>当アプリは、以下のデータを収集します：</p>
            
            <h3 class="privacy-subsection-title">個人情報</h3>
            <ul class="privacy-list">
              <li><strong>メールアドレス</strong>: アカウント認証とログインのために使用</li>
              <li><strong>ユーザー名</strong>: アプリ内での表示のために使用</li>
              <li><strong>パスワード</strong>: アカウント認証のために使用（ハッシュ化して安全に保存）</li>
            </ul>

            <h3 class="privacy-subsection-title">活動・ムード情報</h3>
            <ul class="privacy-list">
              <li><strong>活動記録</strong>: あなたの時間管理とAI分析のために使用</li>
              <li><strong>ムード記録</strong>: あなたの感情管理とAI分析のために使用</li>
            </ul>

            <h3 class="privacy-subsection-title">アプリ設定</h3>
            <ul class="privacy-list">
              <li><strong>AI分析設定</strong>: あなたの好みに合わせてAI分析をカスタマイズ</li>
            </ul>

            <h2 class="privacy-section-title">2. データの共有</h2>
            
            <p>あなたのデータは以下の目的でのみ共有します：</p>
            
            <ul class="privacy-list">
              <li><strong>アプリ機能の提供</strong>: ログイン、データ保存、AI分析機能</li>
              <li><strong>広告表示</strong>: Google AdMobでバナー広告を表示（個人データは送信しません）</li>
              <li><strong>AI分析</strong>: あなたの活動データを匿名化してAI分析に使用</li>
            </ul>
            
            <p><strong>重要</strong>: 個人データを第三者に販売することはありません。</p>

            <h2 class="privacy-section-title">3. データの安全性</h2>
            
            <ul class="privacy-list">
              <li>認証情報は暗号化してデバイスに安全に保存</li>
              <li>サーバーとの通信はすべてHTTPSで暗号化</li>
              <li>アプリは必要最小限の権限のみ使用</li>
            </ul>

            <h2 class="privacy-section-title">4. データの削除</h2>
            
            <ul class="privacy-list">
              <li>アプリ内設定からいつでもアカウントを完全削除できます</li>
              <li>個別の活動・ムード記録も削除可能です</li>
              <li>アプリをアンインストールするとローカルデータは全て削除されます</li>
            </ul>

            <h2 class="privacy-section-title">5. あなたの権利</h2>
            
            <ul class="privacy-list">
              <li>保存されているデータの確認</li>
              <li>不正確なデータの修正</li>
              <li>データの削除要求</li>
              <li>データ処理の停止要求</li>
            </ul>

            <h2 class="privacy-section-title">6. 広告のオプトアウト</h2>
            
            <p>個人化広告を望まない場合、Android設定から「広告の個人設定」でオプトアウトできます。</p>

            <h2 class="privacy-section-title">7. お問い合わせ</h2>
            
            <p>プライバシーに関するご質問やご要望がございましたら、以下までご連絡ください。</p>
            <p class="mb-5">
              <strong>SBM Application 運営</strong><br>
              メール：<a href="mailto:kaminuma.dev@gmail.com">kaminuma.dev@gmail.com</a>
            </p>
          </div>
          
          <div class="text-center mt-10 mb-10">
            <v-btn
              color="primary"
              to="/"
              class="back-button"
            >
              トップページへ戻る
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy'
}
</script>

<style scoped>
.privacy-page {
  padding: 40px 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.privacy-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
  text-align: center;
}

.privacy-updated-date {
  color: #718096;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 600;
}

.privacy-section {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.privacy-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.privacy-subsection-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4a5568;
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
}

.privacy-list {
  padding-left: 2rem;
  margin-bottom: 1.5rem;
}

.privacy-list li {
  margin-bottom: 0.8rem;
  line-height: 1.6;
}

p {
  line-height: 1.7;
  margin-bottom: 1rem;
  color: #4a5568;
}

.back-button {
  min-width: 200px;
  font-weight: 600;
}

a {
  color: #3182ce;
  text-decoration: underline;
}

a:hover {
  color: #2c5aa0;
}

strong {
  font-weight: 600;
  color: #2d3748;
}
</style>