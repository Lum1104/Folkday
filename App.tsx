// App.tsx
import React, { useEffect } from 'react';
import { AppProvider } from './src/contexts/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from '@/components/ErrorBoundary';
import { configureNotifications, requestNotificationPermissions } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    try {
      configureNotifications();
    } catch (error) {
      console.error('Failed to configure notifications:', error);
    }
    requestNotificationPermissions().catch(error =>
      console.error('Failed to request notification permissions:', error),
    );
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </ErrorBoundary>
  );
}
