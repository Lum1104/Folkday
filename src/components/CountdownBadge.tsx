import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CountdownBadgeProps {
  daysUntil: number;
}

export default function CountdownBadge({ daysUntil }: CountdownBadgeProps) {
  const label =
    daysUntil === 0 ? '今天' : daysUntil === 1 ? '明天' : `${daysUntil}天后`;

  const bgColor =
    daysUntil === 0
      ? '#C0392B'
      : daysUntil <= 3
        ? '#D4A574'
        : '#5B7FA5';

  const textColor = '#FFFFFF';

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
