module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-native-async-storage|@react-navigation|react-native-calendars|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-native-swipe-gestures|react-native-vector-icons|recyclerlistview)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
