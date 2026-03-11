// App.tsx
import React, { useEffect } from 'react';
import { AppProvider } from './src/contexts/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { configureNotifications } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    configureNotifications();
  }, []);

  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
