// App.tsx
import React, { useEffect } from 'react';
import { AppProvider } from './src/contexts/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from '@/components/ErrorBoundary';
import { configureNotifications } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    const init = async () => {
      try {
        await configureNotifications();
      } catch (error) {
        console.error('Failed to configure notifications:', error);
      }
    };
    init();
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </ErrorBoundary>
  );
}
