# ダークモード対応 CSS 設計ガイドライン

## 概要
本アプリケーションでは、Vue.js 3 + Vuetify 3を使用したベストプラクティス準拠のダークモードシステムを実装しています。
新規画面・コンポーネント開発時は本ガイドラインに従ってください。

## CSS変数システム

### 基本原則
- ❌ **絶対NG**: ハードコードされた色 (`#333333`, `#ffffff` など)
- ✅ **推奨**: CSS変数の使用 (`var(--theme-text-primary)`)

### 利用可能なCSS変数一覧

#### テキストカラー
```css
--theme-text-primary      /* メインテキスト (Light: #333333, Dark: #ffffff) */
--theme-text-secondary    /* サブテキスト (Light: #666666, Dark: #cccccc) */
--theme-text-tertiary     /* 補助テキスト (Light: #999999, Dark: #999999) */
--theme-text-muted        /* 控えめなテキスト (Light: #555555, Dark: #888888) */
```

#### 背景カラー
```css
--theme-bg-surface        /* カード背景 (Light: #ffffff, Dark: #1e1e1e) */
--theme-bg-primary        /* メイン背景 (Light: #f0f4f8, Dark: #121212) */
--theme-bg-secondary      /* セカンダリ背景 (Light: #f8f9fa, Dark: #2d2d2d) */
--theme-bg-hover          /* ホバー背景 (Light: #f5f5f5, Dark: #333333) */
```

#### アクセントカラー
```css
--theme-accent-blue       /* プライマリアクション (Light: #2196f3, Dark: #64b5f6) */
--theme-accent-blue-hover /* プライマリホバー (Light: #1976d2, Dark: #42a5f5) */
--theme-accent-green      /* 成功・確認 (Light/Dark: #4caf50) */
--theme-accent-red        /* エラー・削除 (Light/Dark: #f44336) */
--theme-accent-purple     /* 特別なアクセント (Light/Dark: #d63aff) */
```

#### 境界線・アウトライン
```css
--theme-outline           /* 基本境界線 (Light: #e0e0e0, Dark: #444444) */
--theme-outline-light     /* 薄い境界線 (Light: #f0f0f0, Dark: #555555) */
--theme-outline-strong    /* 濃い境界線 (Light: #ddd, Dark: #666666) */
--theme-border           /* ボーダー (Light: #e2e8f0, Dark: #444444) */
```

#### リンクカラー
```css
--theme-link              /* リンク (Light: #3182ce, Dark: #64b5f6) */
--theme-link-hover        /* リンクホバー (Light: #2c5aa0, Dark: #42a5f5) */
```

## 実装パターン

### 新規コンポーネントの基本テンプレート
```vue
<template>
  <div class="new-component">
    <h2 class="component-title">タイトル</h2>
    <div class="content-area">
      <p class="description">説明文</p>
      <button class="primary-button">プライマリボタン</button>
      <button class="secondary-button">セカンダリボタン</button>
    </div>
  </div>
</template>

<style scoped>
.new-component {
  background: var(--theme-bg-surface);
  border: 1px solid var(--theme-outline);
  border-radius: 8px;
  padding: 20px;
}

.component-title {
  color: var(--theme-text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.content-area {
  background: var(--theme-bg-secondary);
  padding: 16px;
  border-radius: 4px;
}

.description {
  color: var(--theme-text-secondary);
  margin-bottom: 16px;
}

.primary-button {
  background: var(--theme-accent-blue);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background: var(--theme-accent-blue-hover);
}

.secondary-button {
  background: var(--theme-bg-hover);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-outline);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### よくある使用例

#### カード型コンポーネント
```css
.card {
  background: var(--theme-bg-surface);
  border: 1px solid var(--theme-outline);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  color: var(--theme-text-primary);
  border-bottom: 1px solid var(--theme-outline-light);
}

.card-body {
  color: var(--theme-text-secondary);
}
```

#### テーブル
```css
.data-table {
  background: var(--theme-bg-surface);
  border: 1px solid var(--theme-outline);
}

.data-table th {
  background: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  border-bottom: 2px solid var(--theme-outline-strong);
}

.data-table td {
  color: var(--theme-text-secondary);
  border-bottom: 1px solid var(--theme-outline-light);
}

.data-table tr:hover {
  background: var(--theme-bg-hover);
}
```

#### フォーム
```css
.form-input {
  background: var(--theme-bg-surface);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-outline);
}

.form-input:focus {
  border-color: var(--theme-accent-blue);
  outline: none;
}

.form-label {
  color: var(--theme-text-primary);
  font-weight: 500;
}

.form-help-text {
  color: var(--theme-text-tertiary);
  font-size: 0.875rem;
}
```

## 新しい色が必要な場合

### 1. 既存変数で対応可能かチェック
まず上記の変数リストで要件を満たせるか検討してください。

### 2. 新規色の追加手順

**Step 1: `src/config/theme.js` に色を追加**
```js
export const THEME_CONFIG = {
  THEMES: {
    light: {
      colors: {
        // 既存の色...
        'feature-accent': '#e91e63',
        'feature-accent-light': '#f8bbd9',
      }
    },
    dark: {
      colors: {
        // 既存の色...
        'feature-accent': '#f48fb1',
        'feature-accent-light': '#ad1457',
      }
    }
  }
}
```

**Step 2: `src/App.vue` にCSS変数を追加**
```css
/* App.vue の :root セクション */
:root {
  /* 既存変数... */
  --theme-feature-accent: #e91e63;
  --theme-feature-accent-light: #f8bbd9;
}

[data-theme="dark"] {
  /* 既存変数... */
  --theme-feature-accent: #f48fb1;
  --theme-feature-accent-light: #ad1457;
}
```

**Step 3: コンポーネントで使用**
```css
.special-feature {
  background: var(--theme-feature-accent);
  border: 1px solid var(--theme-feature-accent-light);
}
```

## 命名規則

### CSS変数名
- プレフィックス: `--theme-`
- カテゴリ: `text-`, `bg-`, `accent-`, `outline-`, `border-`
- レベル: `primary`, `secondary`, `tertiary`
- 状態: `hover`, `focus`, `active`

### 例
```css
--theme-text-primary        /* OK */
--theme-bg-hover           /* OK */
--theme-accent-blue-hover  /* OK */
--theme-custom-feature     /* OK (新機能用) */
```

## 禁止事項

❌ **やってはいけないこと:**
```css
/* ハードコードされた色 */
.bad-example {
  color: #333333;
  background: #ffffff;
}

/* v-themeクラス依存 */
.v-theme--light .bad-example { /* NG */ }
.v-theme--dark .bad-example { /* NG */ }

/* テーマ毎の重複スタイル */
.light-mode-style { /* NG */ }
.dark-mode-style { /* NG */ }
```

✅ **正しい書き方:**
```css
.good-example {
  color: var(--theme-text-primary);
  background: var(--theme-bg-surface);
}
```

## デバッグ・確認方法

### 1. テーマ切り替えテスト
設定画面のテーマトグルで、ライト⇔ダーク切り替え時に適切に色が変わることを確認

### 2. システム設定連動テスト
ブラウザの設定でダークモードを切り替えて、アプリが連動することを確認

### 3. 色のコントラスト確認
- 文字の可読性をチェック
- アクセシビリティガイドライン（WCAG）準拠

## チーム開発での注意点

1. **レビュー時のチェック項目**
   - ハードコードされた色が使用されていないか
   - 新規追加のCSS変数は適切に命名されているか
   - ライト・ダーク両モードで適切に表示されるか

2. **コミット前の確認事項**
   - `npm run build` でビルドエラーがないか
   - 両テーマでの表示確認完了
   - 新規CSS変数は `THEME_GUIDELINES.md` を更新

---

**更新履歴:**
- 2025-09-13: 初版作成（feature/053 ダークモード実装完了時）
