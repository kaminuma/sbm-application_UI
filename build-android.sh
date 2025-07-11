#!/bin/bash

# Androidアプリビルドスクリプト

echo "🚀 SBM Application Android ビルド開始"

# 1. 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

# 2. テストの実行
echo "🧪 テストを実行中..."
npm run test:run

if [ $? -ne 0 ]; then
    echo "❌ テストが失敗しました。ビルドを中止します。"
    exit 1
fi

# 3. Vue.jsアプリのビルド
echo "🔨 Vue.jsアプリをビルド中..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Vue.jsビルドが失敗しました。"
    exit 1
fi

# 4. Capacitorの同期
echo "🔄 Capacitorを同期中..."
npx cap sync

if [ $? -ne 0 ]; then
    echo "❌ Capacitor同期が失敗しました。"
    exit 1
fi

# 5. Androidアプリのビルド
echo "📱 Androidアプリをビルド中..."
npx cap build android --release

if [ $? -ne 0 ]; then
    echo "❌ Androidビルドが失敗しました。"
    exit 1
fi

# 6. ビルド結果の確認
echo "✅ ビルド完了！"
echo "📁 生成されたファイル:"
echo "   - APK: android/app/build/outputs/apk/release/app-release.apk"
echo "   - AAB: android/app/build/outputs/bundle/release/app-release.aab"

# 7. ファイルサイズの表示
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    APK_SIZE=$(du -h android/app/build/outputs/apk/release/app-release.apk | cut -f1)
    echo "📊 APKサイズ: $APK_SIZE"
fi

if [ -f "android/app/build/outputs/bundle/release/app-release.aab" ]; then
    AAB_SIZE=$(du -h android/app/build/outputs/bundle/release/app-release.aab | cut -f1)
    echo "📊 AABサイズ: $AAB_SIZE"
fi

echo "🎉 Androidアプリビルドが完了しました！" 