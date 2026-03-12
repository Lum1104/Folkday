// src/services/notificationService.ts
import PushNotification from 'react-native-push-notification';
import { Platform, PermissionsAndroid } from 'react-native';
import { UserPreferences } from '../types';
import { getFestivalsByRegions } from '../data';
import { getFestivalSolarDate } from './lunarService';

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('POST_NOTIFICATIONS permission not granted:', result);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
}

export function configureNotifications() {
  try {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: { alert: true, badge: true, sound: true },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'festival-reminders',
        channelName: '节日提醒',
        channelDescription: '传统节日提醒通知',
        importance: 4,
        vibrate: true,
      },
      () => {}
    );
  } catch (error) {
    console.error('Failed to configure notifications:', error);
  }
}

export function scheduleAllReminders(preferences: UserPreferences) {
  try {
    PushNotification.cancelAllLocalNotifications();
    if (!preferences.reminderEnabled) return;

    const festivals = getFestivalsByRegions(preferences.selectedRegions);
    const year = new Date().getFullYear();

    // Validate reminderTime format (HH:MM)
    const timeStr =
      typeof preferences.reminderTime === 'string' &&
      /^\d{2}:\d{2}$/.test(preferences.reminderTime)
        ? preferences.reminderTime
        : '09:00';
    const [parsedHours, parsedMinutes] = timeStr.split(':').map(Number);
    const hours = isNaN(parsedHours) ? 9 : parsedHours;
    const minutes = isNaN(parsedMinutes) ? 0 : parsedMinutes;

    for (const festival of festivals) {
      const solarDate = getFestivalSolarDate(year, festival);
      if (!solarDate) continue;

      const daysAhead = preferences.reminderDays?.[festival.importance];
      if (daysAhead == null) continue;
      if (daysAhead <= 0 && festival.importance === 'low') continue;

      const festDate = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
      const reminderDate = new Date(festDate);
      reminderDate.setDate(reminderDate.getDate() - daysAhead);
      reminderDate.setHours(hours, minutes, 0, 0);

      if (reminderDate.getTime() < Date.now()) continue;

      PushNotification.localNotificationSchedule({
        channelId: 'festival-reminders',
        title: festival.name + ' 即将到来',
        message:
          daysAhead === 0
            ? '今天是' + festival.name + '，记得做好准备'
            : '还有 ' + daysAhead + ' 天就是' + festival.name + '了，提前准备吧',
        date: reminderDate,
        allowWhileIdle: true,
        userInfo: { festivalId: festival.id },
      });
    }
  } catch (error) {
    console.error('Failed to schedule reminders:', error);
  }
}
