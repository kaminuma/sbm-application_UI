<template>
  <div class="privacy-page">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="privacy-title">プライバシーポリシー</h1>
          <div class="privacy-updated-date">最終更新日: 2025年8月28日</div>
          
          <div class="privacy-section">
            <p class="mb-5">
              SBM Application（以下「当アプリ」といいます）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。本ポリシーは、Google Play Store のデータ安全性要件に準拠し、ユーザーの皆様に透明性の高い情報を提供します。
            </p>
            
            <h2 class="privacy-section-title">1. 収集するデータの種類</h2>
            <p>当アプリは、以下のデータを収集します：</p>
            
            <h3 class="privacy-subsection-title">個人情報</h3>
            <ul class="privacy-list">
              <li><strong>メールアドレス</strong>（ユーザー登録時またはGoogle認証経由で取得）
                <ul class="privacy-sublist">
                  <li>用途: アカウント認証、ログイン識別</li>
                  <li>共有: SBMバックエンドAPIのみ（認証目的）</li>
                  <li>暗号化: EncryptedSharedPreferences（AES256_GCM）で保存</li>
                </ul>
              </li>
              <li><strong>ユーザー名・パスワード</strong>（通常の登録時）
                <ul class="privacy-sublist">
                  <li>用途: アカウント認証、アプリ内表示</li>
                  <li>パスワード: ハッシュ化してサーバーに保存</li>
                  <li>共有: SBMバックエンドAPIのみ</li>
                  <li>暗号化: EncryptedSharedPreferences（AES256_GCM）で保存</li>
                </ul>
              </li>
            </ul>

            <h3 class="privacy-subsection-title">健康とフィットネス情報</h3>
            <ul class="privacy-list">
              <li><strong>活動記録（Activity）</strong>
                <ul class="privacy-sublist">
                  <li>活動名（title）、詳細内容（contents、任意）</li>
                  <li>開始・終了時刻（start/end）、記録日（date）</li>
                  <li>カテゴリ分類（category/categorySub）</li>
                  <li>用途: 個人の時間管理、AI分析による洞察提供</li>
                  <li>共有: SBMバックエンドAPI（AI分析目的）</li>
                </ul>
              </li>
              <li><strong>ムード記録（MoodRecord）</strong>
                <ul class="privacy-sublist">
                  <li>気分レベル（1-5の数値）、メモ、記録日</li>
                  <li>用途: 個人の感情管理、AI分析による洞察提供</li>
                  <li>共有: SBMバックエンドAPI（AI分析目的）</li>
                </ul>
              </li>
            </ul>

            <h3 class="privacy-subsection-title">アプリ設定・統計データ</h3>
            <ul class="privacy-list">
              <li><strong>AI分析設定</strong>（ローカル保存）
                <ul class="privacy-sublist">
                  <li>分析フォーカス、詳細レベル、レスポンススタイル設定</li>
                  <li>用途: AI分析のカスタマイズ</li>
                  <li>共有: なし（ローカル設定のみ）</li>
                </ul>
              </li>
              <li><strong>分析メトリクス</strong>（ローカル保存）
                <ul class="privacy-sublist">
                  <li>AI分析のパフォーマンス統計、処理時間、成功率</li>
                  <li>用途: アプリ改善、デバッグ</li>
                  <li>共有: なし（ローカル統計のみ）</li>
                </ul>
              </li>
            </ul>

            <h2 class="privacy-section-title">2. 第三者との共有</h2>
            
            <h3 class="privacy-subsection-title">SBMバックエンドAPI</h3>
            <ul class="privacy-list">
              <li>目的: アプリの全機能提供（認証、データ保存、AI分析）</li>
              <li>送信データ: ユーザー情報、活動記録、ムード記録、AI分析リクエスト</li>
              <li>データフロー: SBMバックエンド → Google Gemini API（バックエンド側で実行）</li>
              <li><strong>重要</strong>: アプリから直接Gemini APIにはアクセスしません</li>
            </ul>

            <h3 class="privacy-subsection-title">Google AdMob（広告サービス）</h3>
            <ul class="privacy-list">
              <li>目的: バナー広告表示</li>
              <li>自動収集データ: 広告識別子（Advertising ID）、デバイス情報、広告表示・クリック情報</li>
              <li>本アプリからの送信: 個人データは一切送信しません</li>
              <li>プライバシーポリシー: <a href="https://policies.google.com/privacy" target="_blank">https://policies.google.com/privacy</a></li>
              <li><strong>オプトアウト</strong>: Android設定「広告の個人設定」から可能</li>
            </ul>

            <h3 class="privacy-subsection-title">Google Gemini API（間接的）</h3>
            <ul class="privacy-list">
              <li>経路: SBMバックエンドAPI経由のみ</li>
              <li>目的: AI分析による個人洞察生成</li>
              <li>アプリからの直接送信: なし</li>
              <li>バックエンドから送信: 匿名化された活動・ムードデータ</li>
            </ul>

            <h2 class="privacy-section-title">3. データの保護・セキュリティ</h2>
            
            <h3 class="privacy-subsection-title">保存時の暗号化</h3>
            <ul class="privacy-list">
              <li><strong>EncryptedSharedPreferences（AES256_GCM）</strong>
                <ul class="privacy-sublist">
                  <li>認証トークン、ユーザーID、ユーザー名、メールアドレス</li>
                  <li>リフレッシュトークン</li>
                </ul>
              </li>
            </ul>

            <h3 class="privacy-subsection-title">通信時の暗号化</h3>
            <ul class="privacy-list">
              <li><strong>HTTPS/TLS通信</strong>による全API通信</li>
              <li><strong>HTTP通信の完全無効化</strong>（cleartextTrafficPermitted=false）</li>
            </ul>

            <h3 class="privacy-subsection-title">権限の最小化</h3>
            <ul class="privacy-list">
              <li>INTERNET: API通信用</li>
              <li>ACCESS_NETWORK_STATE: ネットワーク状態監視用</li>
              <li>USE_BIOMETRIC: 生体認証用（今後の実装予定）</li>
            </ul>

            <h2 class="privacy-section-title">4. データ保持期間と削除</h2>
            
            <h3 class="privacy-subsection-title">ユーザーによる削除</h3>
            <ul class="privacy-list">
              <li><strong>個別削除</strong>: 各活動・ムード記録の個別削除可能</li>
              <li><strong>アカウント削除</strong>: アプリ内設定画面から完全削除可能</li>
              <li><strong>ローカルデータ</strong>: アプリアンインストール時に全て削除</li>
            </ul>

            <h3 class="privacy-subsection-title">自動削除</h3>
            <ul class="privacy-list">
              <li><strong>認証トークン</strong>: 期限切れ時に自動削除</li>
              <li><strong>キャッシュデータ</strong>: アプリ再起動時にクリア</li>
            </ul>

            <h2 class="privacy-section-title">5. 地域別プライバシー規制への対応</h2>
            
            <h3 class="privacy-subsection-title">GDPR対応（欧州）</h3>
            <ul class="privacy-list">
              <li>データ処理の法的根拠: 正当な利益（個人の時間・ムード管理）</li>
              <li>データ保持期間: ユーザー削除要求まで</li>
              <li>削除権: Web管理画面から実行可能</li>
            </ul>

            <h3 class="privacy-subsection-title">CCPA対応（カリフォルニア州）</h3>
            <ul class="privacy-list">
              <li>個人情報の販売: 行っていません</li>
              <li>データアクセス権: 技術的制約により現在は非対応（今後実装予定）</li>
            </ul>

            <h2 class="privacy-section-title">6. 使用SDK・ライブラリのデータ収集</h2>
            
            <h3 class="privacy-subsection-title">データ収集を行うSDK</h3>
            <ul class="privacy-list">
              <li><strong>Google Mobile Ads SDK（AdMob）</strong>: 広告ID、デバイス情報、広告統計</li>
            </ul>

            <h3 class="privacy-subsection-title">データ収集を行わないライブラリ</h3>
            <ul class="privacy-list">
              <li>OkHttp3 / Retrofit2: HTTP通信ライブラリ</li>
              <li>Hilt: 依存注入フレームワーク</li>
              <li>Jetpack Compose: UIライブラリ</li>
              <li>androidx.security: 暗号化ライブラリ</li>
            </ul>

            <h2 class="privacy-section-title">7. お客様の権利</h2>
            <ul class="privacy-list">
              <li><strong>アクセス権</strong>: アプリ内で保存データの確認可能</li>
              <li><strong>訂正権</strong>: アプリ内でデータの編集可能</li>
              <li><strong>削除権</strong>: アプリ内設定から個別・完全削除可能</li>
              <li><strong>データポータビリティ権</strong>: データの移行（技術的制約により将来対応予定）</li>
              <li><strong>処理停止権</strong>: メールでの要求に対応</li>
            </ul>

            <h2 class="privacy-section-title">8. 広告のオプトアウト</h2>
            <p>
              Google AdMobによる個人に最適化された広告を望まない場合、以下の方法でオプトアウトできます：
            </p>
            <ul class="privacy-list">
              <li><strong>Android</strong>: 設定 → Google → 広告 → 「広告の個人設定をリセット」または「広告の個人設定をオプトアウト」</li>
              <li><strong>Google広告設定</strong>: <a href="https://www.google.com/settings/ads" target="_blank">https://www.google.com/settings/ads</a></li>
            </ul>

            <h2 class="privacy-section-title">9. 未成年者のプライバシー</h2>
            <p>
              当アプリは、16歳未満の方による利用を想定していません。16歳未満の方が個人情報を提供する場合は、保護者の同意を得た上で行ってください。16歳未満のユーザーから同意なく個人情報が提供されていると判明した場合、当アプリはそのデータを削除するための措置を講じます。
            </p>

            <h2 class="privacy-section-title">10. プライバシーポリシーの変更</h2>
            <p>
              当アプリは、必要に応じて本ポリシーを変更することがあります。変更後のプライバシーポリシーは、当アプリ上に掲載した時点から効力を生じるものとします。重要な変更がある場合は、アプリ内の通知または当アプリの公式連絡先での告知により、変更内容を通知いたします。
            </p>

            <h2 class="privacy-section-title">11. お問い合わせ・削除要求</h2>
            <p>
              本ポリシーに関するご質問、個人情報の削除要求、その他お問い合わせは、以下の連絡先までご連絡ください。アカウント削除はアプリ内設定画面から実行でき、メールでの削除要求については本人確認後、合理的な期間内（通常7-30日以内）に対応いたします。
            </p>
            <p class="mb-5">
              <strong>SBM Application 運営</strong><br>
              お問い合わせ連絡先：<a href="mailto:kaminuma.dev@gmail.com">kaminuma.dev@gmail.com</a>
            </p>

            <div class="data-safety-summary">
              <h2 class="privacy-section-title">データ安全性の要約</h2>
              
              <h3 class="privacy-subsection-title">収集データ</h3>
              <ul class="privacy-list">
                <li>✅ 個人情報（メールアドレス、ユーザー名）</li>
                <li>✅ 健康・フィットネス情報（活動記録、ムード記録）</li>
                <li>✅ アプリ設定データ（AI分析設定、パフォーマンス統計）</li>
                <li>❌ 位置情報</li>
                <li>❌ 写真・動画</li>
                <li>❌ 音声データ</li>
                <li>❌ ファイル・ドキュメント</li>
              </ul>

              <h3 class="privacy-subsection-title">データの共有</h3>
              <ul class="privacy-list">
                <li>✅ 機能提供目的（SBMバックエンドAPI → Gemini API）</li>
                <li>✅ 広告表示目的（Google AdMob）</li>
                <li>❌ データ販売</li>
                <li>❌ 直接的な第三者分析目的</li>
              </ul>

              <h3 class="privacy-subsection-title">セキュリティ対策</h3>
              <ul class="privacy-list">
                <li>✅ 保存時暗号化（EncryptedSharedPreferences）</li>
                <li>✅ 通信時暗号化（HTTPS/TLS）</li>
                <li>✅ ユーザーによる削除可能</li>
                <li>✅ 最小権限の原則</li>
              </ul>
            </div>
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

.privacy-sublist {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.privacy-sublist li {
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
  color: #718096;
}

p {
  line-height: 1.7;
  margin-bottom: 1rem;
  color: #4a5568;
}

.data-safety-summary {
  background-color: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  border-left: 4px solid #3182ce;
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