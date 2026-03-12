#!/bin/bash
set -e

cd "$(dirname "$0")/.."

export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"

echo "Starting Metro bundler..."
npx react-native start --reset-cache &
METRO_PID=$!

sleep 3

echo "Building and running on Android Emulator..."
npx react-native run-android

wait $METRO_PID
