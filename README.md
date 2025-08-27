# SBM Application UI

[![Release](https://img.shields.io/badge/release-live-brightgreen)](https://sbm-app.com/)
[![Version](https://img.shields.io/badge/version-0.4.0-green)](https://github.com/kaminuma/sbm-application_UI)
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

### 📱 マルチプラットフォーム展開

- **Androidアプリ版** - [開発中](https://github.com/kaminuma/sbm-application-android-native) 🚧
  - AI週間分析機能を先行実装
  - Jetpack Compose + Material 3デザイン
  - Clean Architectureアプローチ
- **iOS版** - 開発検討中

## ✨ 主な機能

### 📅 活動記録管理
- **予定と実績の管理**: カレンダー形式で直感的に記録・確認
- **活動の詳細記録**: 時間、場所、メモなど詳細な情報の保存
- **データインポート**: CSVファイルによる一括データ取り込み
- **レスポンシブ対応**: スマートフォン・タブレット・PC対応

### 💭 気分記録機能
- **日々の気分登録**: 5段階評価で簡単に気分を記録
- **メモ機能**: その日の出来事や感情を詳しく記録
- **気分の推移表示**: グラフで気分の変化を可視化
- **パターン分析**: 気分と活動の関連性を分析

### ⚙️ 設定・アカウント管理 *（v0.3.0新機能）*
- **ユーザー設定**: プロフィール情報の表示・管理
- **パスワード変更**: ローカルアカウントのセキュリティ管理
- **退会機能**: アカウントの安全な無効化
- **データ管理**: 個人データの取り扱いを明確化

### 🌐 SEO・SNSシェア対応 *（v0.4.0新機能）*
- **OGP対応**: Facebook等でのシェア時に適切な画像・情報表示
- **Twitter Card対応**: Twitterでのシェア時に最適化された表示
- **構造化データ**: 検索エンジン向けのメタデータ実装
- **SNSシェア用画像**: SBMブランドロゴを活用したオリジナル画像

### 📊 分析・インサイト機能
- **基本分析**: 活動記録と気分データの基本的な分析・可視化 ✅
- **AI分析機能**: 機械学習によるパーソナライズされた洞察 *（開発中）*
- **高度な統計分析**: より詳細なデータ分析機能 *（開発中）*
- **データエクスポート**: 記録データの外部出力機能 *（開発中）*

> **Note**: AI週間分析機能は[Androidアプリ版](https://github.com/kaminuma/sbm-application-android-native)で先行開発中です

### 🔐 セキュリティ・プライバシー
- **多様な認証方式**: JWT認証、Google OAuth2対応
- **透明性のあるデータ管理**: 明確な利用規約・プライバシーポリシー
- **退会時の適切な処理**: データ保持期間の明示
- **問い合わせ対応**: メールでの直接サポート

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

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

### 🐛 バグ報告・機能要望
- [GitHub Issues](https://github.com/kaminuma/sbm-application_UI/issues)からお気軽にお知らせください
- 既知の技術的課題や改善予定についてもIssuesで管理しています

### 💡 開発への参加

プルリクエストも歓迎します！

## 📄 ライセンス

このプロジェクトは[Apache License 2.0](LICENSE)のもとで公開されています。

## 📧 お問い合わせ

- **メール**: kaminuma.dev@gmail.com
- **GitHub Issues**: [バグ報告・機能要望](https://github.com/kaminuma/sbm-application_UI/issues)
- **プロジェクトオーナー**: [@kaminuma](https://github.com/kaminuma)

---

**Last Updated:** 2025年8月27日  
**Current Version:** v0.4.0