#!/bin/bash

# Android環境変数設定スクリプト

echo "🔧 Android環境変数を設定中..."

# Android SDKの場所を確認
ANDROID_SDK_PATH=""

# 一般的なAndroid SDKの場所をチェック
if [ -d "$HOME/Library/Android/sdk" ]; then
    ANDROID_SDK_PATH="$HOME/Library/Android/sdk"
elif [ -d "/Applications/Android Studio.app/Contents/sdk" ]; then
    ANDROID_SDK_PATH="/Applications/Android Studio.app/Contents/sdk"
else
    echo "❌ Android SDKが見つかりません"
    echo "Android Studioをインストールして、Android SDKをセットアップしてください"
    exit 1
fi

echo "✅ Android SDK found at: $ANDROID_SDK_PATH"

# 環境変数を設定
export ANDROID_HOME="$ANDROID_SDK_PATH"
export ANDROID_SDK_ROOT="$ANDROID_SDK_PATH"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/tools"
export PATH="$PATH:$ANDROID_HOME/tools/bin"
export PATH="$PATH:$ANDROID_HOME/platform-tools"

echo "✅ 環境変数を設定しました:"
echo "   ANDROID_HOME=$ANDROID_HOME"
echo "   ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT"

# 環境変数を.zshrcに追加（永続化）
if [ -f "$HOME/.zshrc" ]; then
    if ! grep -q "ANDROID_HOME" "$HOME/.zshrc"; then
        echo "" >> "$HOME/.zshrc"
        echo "# Android SDK" >> "$HOME/.zshrc"
        echo "export ANDROID_HOME=\"$ANDROID_HOME\"" >> "$HOME/.zshrc"
        echo "export ANDROID_SDK_ROOT=\"$ANDROID_SDK_ROOT\"" >> "$HOME/.zshrc"
        echo "export PATH=\"\$PATH:\$ANDROID_HOME/emulator\"" >> "$HOME/.zshrc"
        echo "export PATH=\"\$PATH:\$ANDROID_HOME/tools\"" >> "$HOME/.zshrc"
        echo "export PATH=\"\$PATH:\$ANDROID_HOME/tools/bin\"" >> "$HOME/.zshrc"
        echo "export PATH=\"\$PATH:\$ANDROID_HOME/platform-tools\"" >> "$HOME/.zshrc"
        echo "✅ .zshrcに環境変数を追加しました"
    else
        echo "ℹ️  .zshrcに既にAndroid環境変数が設定されています"
    fi
fi

echo "🎉 Android環境変数の設定が完了しました！"
echo "📱 次にAndroidアプリのビルドを試してください:"
echo "   npx cap build android" 