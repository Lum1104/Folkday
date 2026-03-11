// src/screens/ReminderSettings.tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { scheduleAllReminders } from '../services/notificationService';

const IMPORTANCE_LABELS: Record<'high' | 'medium' | 'low', { label: string; desc: string }> = {
  high: { label: '重要节日', desc: '春节、清明、中秋等' },
  medium: { label: '一般节日', desc: '元宵、端午、重阳等' },
  low: { label: '次要节日', desc: '神明诞辰、民俗纪念日等' },
};

export default function ReminderSettings() {
  const { state, dispatch } = useAppContext();
  const { reminderEnabled, reminderDays, reminderTime } = state.preferences;
  const insets = useSafeAreaInsets();

  const handleToggle = useCallback(
    (value: boolean) => {
      dispatch({ type: 'SET_REMINDER_ENABLED', payload: value });
      const updated = { ...state.preferences, reminderEnabled: value };
      scheduleAllReminders(updated);
    },
    [dispatch, state.preferences],
  );

  const handleDaysChange = useCallback(
    (importance: 'high' | 'medium' | 'low', delta: number) => {
      const current = reminderDays[importance];
      const next = Math.max(0, Math.min(30, current + delta));
      if (next === current) return;
      dispatch({
        type: 'SET_REMINDER_DAYS',
        payload: { importance, days: next },
      });
    },
    [dispatch, reminderDays],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.title}>提醒设置</Text>

      {/* Global toggle */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>节日提醒</Text>
            <Text style={styles.toggleDesc}>
              开启后将在节日前收到通知提醒
            </Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: '#DDD', true: '#C0392B80' }}
            thumbColor={reminderEnabled ? '#C0392B' : '#F4F4F4'}
          />
        </View>
      </View>

      {/* Per-importance steppers */}
      <Text style={styles.sectionTitle}>提前提醒天数</Text>
      <View style={[styles.card, !reminderEnabled && styles.cardDisabled]}>
        {(['high', 'medium', 'low'] as const).map((importance, index) => {
          const info = IMPORTANCE_LABELS[importance];
          const days = reminderDays[importance];
          return (
            <View key={importance}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.stepperRow}>
                <View style={styles.stepperInfo}>
                  <Text
                    style={[
                      styles.stepperLabel,
                      !reminderEnabled && styles.textDisabled,
                    ]}
                  >
                    {info.label}
                  </Text>
                  <Text style={styles.stepperDesc}>{info.desc}</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[
                      styles.stepperBtn,
                      (!reminderEnabled || days <= 0) && styles.stepperBtnDisabled,
                    ]}
                    onPress={() => handleDaysChange(importance, -1)}
                    disabled={!reminderEnabled || days <= 0}
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.stepperValue,
                      !reminderEnabled && styles.textDisabled,
                    ]}
                  >
                    {days} 天
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.stepperBtn,
                      (!reminderEnabled || days >= 30) && styles.stepperBtnDisabled,
                    ]}
                    onPress={() => handleDaysChange(importance, 1)}
                    disabled={!reminderEnabled || days >= 30}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Reminder time display */}
      <Text style={styles.sectionTitle}>提醒时间</Text>
      <View style={[styles.card, !reminderEnabled && styles.cardDisabled]}>
        <View style={styles.timeRow}>
          <Text
            style={[styles.timeLabel, !reminderEnabled && styles.textDisabled]}
          >
            每日提醒时间
          </Text>
          <Text
            style={[styles.timeValue, !reminderEnabled && styles.textDisabled]}
          >
            {reminderTime}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7F0',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginTop: 24,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 13,
    color: '#888',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperInfo: {
    flex: 1,
    marginRight: 12,
  },
  stepperLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  stepperDesc: {
    fontSize: 12,
    color: '#999',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EBE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.3,
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C0392B',
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C2C2C',
    minWidth: 48,
    textAlign: 'center',
  },
  textDisabled: {
    color: '#BBB',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  timeValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#C0392B',
  },
});
