# SBM Application UI

[![Release](https://img.shields.io/badge/release-live-brightgreen)](https://sbm-app.com/)
[![Version](https://img.shields.io/badge/version-0.3.0-green)](https://github.com/kaminuma/sbm-application_UI)
[![License](https://img.shields.io/badge/license-Apache%202.0-yellow)](LICENSE)

生活記録の管理・分析を通じて、日々の生活をより充実させるWebアプリケーション

## 🎯 アプリケーションの目的

SBM Application UIは、以下のような方々に向けた生活支援ツールです：

- 📊 日々の生活記録を体系的に管理したい方
- 📈 データ分析を通じて自己理解を深めたい方
- 📅 スケジュール管理を効率化したい方
- 💭 気分の変化を追跡し、メンタルヘルスケアに活用したい方

## 🌐 サービス利用

**[SBMアプリ](https://sbm-app.com/)**

Google Search Console登録済みの正式サービスです。どなたでもご利用いただけます。

### 📱 今後の展開

- **Androidアプリ版** - 近日リリース予定
- **iOS版** - 開発検討中

## ✨ 主な機能

### 実装済み機能
- ✅ **ユーザー認証** - JWT/OAuth2.0（Google）による安全な認証
- ✅ **気分記録** - 日々の気分を記録・可視化
- ✅ **スケジュール管理** - Vue Calを使用した直感的なカレンダー表示
- ✅ **データアップロード** - CSVファイルによるデータインポート
- ✅ **レスポンシブデザイン** - モバイル・タブレット対応

### 開発中の機能
- 🔄 **AI分析機能** - 生活記録データのAI分析（API側実装待ち）
- 🔄 **データエクスポート** - 各種フォーマットでのデータ出力
- 🔄 **詳細な統計情報** - より高度な分析ダッシュボード

## 🛠️ 技術スタック

- **Vue.js 3** - フロントエンドフレームワーク
- **Vuetify 3** - UIコンポーネントライブラリ
- **Vue Router** - ルーティング
- **Vuex** - 状態管理
- **Axios** - HTTP通信
- **Chart.js / ECharts** - データ可視化
- **Vitest** - テストフレームワーク
- **Vite** - ビルドツール
- **AWS** - インフラストラクチャ
- **GitHub Actions** - CI/CD

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js 16.x以上（推奨: 20.x）
- npm または yarn
- Git

### インストール手順

1. **リポジトリのクローン**
```bash
git clone https://github.com/kaminuma/sbm-application_UI.git
cd sbm-application_UI
```

2. **環境変数の設定**

`src/.env.example`を参考に、プロジェクトルートに`.env`ファイルを作成：

```env
# 基本設定
VITE_BASE_URL=/
VITE_API_BASE_URL=http://localhost:8080/api/v1

# OAuth2.0設定（Google認証を使用する場合）
VITE_OAUTH2_BASE_URL=http://localhost:8080
```

**注意**: Google認証を使用する場合は、`VITE_OAUTH2_BASE_URL`を適切なAPIサーバーのURLに設定してください。

3. **依存関係のインストール**
```bash
npm install
```

4. **開発サーバーの起動**
```bash
npm run dev
```

ブラウザで http://localhost:5173/ にアクセス

### 利用可能なスクリプト

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run build:prod   # プロダクションモードでビルド
npm run preview      # ビルドのプレビュー
npm run test         # テスト実行（watch mode）
npm run test:run     # テスト実行（単発）
npm run test:ui      # Vitest UIでテスト実行
npm run test:coverage # カバレッジレポート生成
```

## 📁 プロジェクト構造

```
sbm-application_UI/
├── src/
│   ├── api/          # API通信関連
│   ├── assets/       # 静的アセット
│   ├── components/   # Vueコンポーネント
│   ├── plugins/      # Vueプラグイン（Vuetify等）
│   ├── router/       # ルーティング設定
│   ├── services/     # ビジネスロジック
│   ├── store/        # Vuex状態管理
│   └── test/         # テストファイル
├── public/           # 公開静的ファイル
├── .github/          # GitHub Actions設定
└── vite.config.js    # Vite設定
```

## 🔐 認証システム

### JWT認証
- アクセストークンによるAPI認証
- Vuex-persistedstateによるトークン永続化
- 自動ログアウト機能（トークン有効期限切れ時）

### OAuth2.0（Google認証）
- Googleアカウントでのシングルサインオン
- セキュアな認証フロー実装

## 📊 API連携

バックエンドAPIリポジトリ：

https://github.com/kaminuma/sbm-application_API

## 🐛 既知の問題と改善点

### 優先度：高
- 🔴 JWTトークン期限切れ時の403エラーハンドリング改善
- 🔴 トークンリフレッシュ機能の実装

### 優先度：中
- 🟡 AI分析機能のUI実装（API完成待ち）
- 🟡 データエクスポート機能の実装
- 🟡 パフォーマンス最適化（大量データ時）

### 優先度：低
- 🟢 E2Eテストの導入（Cypress）
- 🟢 国際化（i18n）対応
- 🟢 ダークモード対応


## 🤝 コントリビューション

バグ報告や機能要望は[Issues](https://github.com/kaminuma/sbm-application_UI/issues)からお願いします。

プルリクエストも歓迎します！

## 📄 ライセンス

このプロジェクトは[Apache License 2.0](LICENSE)のもとで公開されています。

## 📧 お問い合わせ

- GitHub Issues: [バグ報告・機能要望](https://github.com/kaminuma/sbm-application_UI/issues)
- プロジェクトオーナー: [@kaminuma](https://github.com/kaminuma)

---

**Last Updated:** 2025年8月25日
**Current Version:** v0.2.0