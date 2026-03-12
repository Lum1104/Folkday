#!/bin/bash
set -e

cd "$(dirname "$0")/.."

export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"

echo "Building release APK..."
cd android
./gradlew assembleRelease

APK_PATH="app/build/outputs/apk/release/app-release.apk"

if [ -f "$APK_PATH" ]; then
    SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo ""
    echo "Build successful!"
    echo "APK: android/$APK_PATH ($SIZE)"
    echo ""
    echo "To install on connected device:"
    echo "  adb install $APK_PATH"
else
    echo "Build failed - APK not found"
    exit 1
fi
