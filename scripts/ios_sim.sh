#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Starting Metro bundler..."
npx react-native start --reset-cache &
METRO_PID=$!

sleep 3

echo "Building and running on iOS Simulator..."
npx react-native run-ios

wait $METRO_PID
