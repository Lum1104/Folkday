// src/services/notificationService.ts
import PushNotification from 'react-native-push-notification';
import { UserPreferences } from '../types';
import { getFestivalsByRegions } from '../data';
import { getFestivalSolarDate } from './lunarService';

export function configureNotifications() {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: { alert: true, badge: true, sound: true },
    popInitialNotification: true,
    requestPermissions: true,
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
}

export function scheduleAllReminders(preferences: UserPreferences) {
  PushNotification.cancelAllLocalNotifications();
  if (!preferences.reminderEnabled) return;

  const festivals = getFestivalsByRegions(preferences.selectedRegions);
  const year = new Date().getFullYear();
  const [hours, minutes] = preferences.reminderTime.split(':').map(Number);

  for (const festival of festivals) {
    const solarDate = getFestivalSolarDate(year, festival);
    if (!solarDate) continue;

    const daysAhead = preferences.reminderDays[festival.importance];
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
}
