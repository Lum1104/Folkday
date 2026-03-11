import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DualDateCellProps {
  day: number;
  lunarDay: string;
  isToday: boolean;
  isSelected: boolean;
  festivalCount: number;
  highImportance: boolean;
  onPress: () => void;
}

export default function DualDateCell({
  day,
  lunarDay,
  isToday,
  isSelected,
  festivalCount,
  highImportance,
  onPress,
}: DualDateCellProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isToday && styles.today,
        isSelected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.solarDay,
          isToday && !isSelected && styles.todayText,
          isSelected && styles.selectedText,
        ]}
      >
        {day}
      </Text>
      <Text
        style={[
          styles.lunarDay,
          isToday && !isSelected && styles.todayLunarText,
          isSelected && styles.selectedLunarText,
        ]}
      >
        {lunarDay}
      </Text>
      {festivalCount > 0 && (
        <View style={styles.dotRow}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: highImportance ? '#C0392B' : '#D4A574',
              },
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  today: {
    borderWidth: 1.5,
    borderColor: '#C0392B',
  },
  selected: {
    backgroundColor: '#C0392B',
  },
  solarDay: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C2C2C',
    lineHeight: 22,
  },
  lunarDay: {
    fontSize: 10,
    color: '#888888',
    lineHeight: 14,
    marginTop: 1,
  },
  todayText: {
    color: '#C0392B',
  },
  todayLunarText: {
    color: '#C0392B',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  selectedLunarText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dotRow: {
    flexDirection: 'row',
    marginTop: 3,
    gap: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
