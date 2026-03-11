// src/screens/CalendarScreen.tsx
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useAppContext } from '../contexts/AppContext';
import { getFestivalsForMonth, getDaysUntilFestival } from '../services/festivalService';
import { getDayFestivalInfo } from '../services/festivalService';
import { getLunarDateInfo } from '../services/lunarService';
import { formatDate, parseDate } from '../utils/dateUtils';
import FestivalCard from '../components/FestivalCard';
import type { Festival } from '../types';

const REGION_COLORS: Record<string, string> = {
  chaoshan: '#C0392B',
  minnan: '#E67E22',
  guangfu: '#D4A017',
  kejia: '#27826B',
};

interface CalendarScreenProps {
  navigation: any;
}

export default function CalendarScreen({ navigation }: CalendarScreenProps) {
  const { state, dispatch } = useAppContext();
  const { preferences, selectedDate } = state;
  const { selectedRegions } = preferences;

  // Current visible month (year, month)
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const [visibleYear, setVisibleYear] = useState(today.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(today.getMonth() + 1);

  // If no date selected, default to today
  const effectiveDate = selectedDate || todayStr;

  // Parse the effective date
  const parsedDate = useMemo(() => parseDate(effectiveDate), [effectiveDate]);

  // Lunar info for the selected date (header display)
  const lunarInfo = useMemo(
    () => getLunarDateInfo(parsedDate.year, parsedDate.month, parsedDate.day),
    [parsedDate.year, parsedDate.month, parsedDate.day],
  );

  // Festivals for the visible month (for marking calendar dates)
  const monthFestivals = useMemo(
    () => getFestivalsForMonth(visibleYear, visibleMonth, selectedRegions),
    [visibleYear, visibleMonth, selectedRegions],
  );

  // Build marked dates for the calendar
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    // Mark festival dates with dots
    for (const { festival, solarDate } of monthFestivals) {
      const dateStr = formatDate(solarDate.year, solarDate.month, solarDate.day);
      const color = REGION_COLORS[festival.region] || '#C0392B';
      if (!marks[dateStr]) {
        marks[dateStr] = { dots: [], marked: true };
      }
      // Avoid duplicate dots for same region
      const existingColors = marks[dateStr].dots.map((d: any) => d.color);
      if (!existingColors.includes(color)) {
        marks[dateStr].dots.push({ key: festival.region, color });
      }
    }

    // Mark the selected date
    if (marks[effectiveDate]) {
      marks[effectiveDate] = {
        ...marks[effectiveDate],
        selected: true,
        selectedColor: '#C0392B',
      };
    } else {
      marks[effectiveDate] = {
        selected: true,
        selectedColor: '#C0392B',
        dots: [],
      };
    }

    return marks;
  }, [monthFestivals, effectiveDate]);

  // Festivals for the selected date (bottom list)
  const dayInfo = useMemo(
    () => getDayFestivalInfo(parsedDate.year, parsedDate.month, parsedDate.day, selectedRegions),
    [parsedDate.year, parsedDate.month, parsedDate.day, selectedRegions],
  );

  // Handle date selection
  const onDayPress = useCallback(
    (day: DateData) => {
      dispatch({ type: 'SET_SELECTED_DATE', payload: day.dateString });
    },
    [dispatch],
  );

  // Handle month change
  const onMonthChange = useCallback((month: DateData) => {
    setVisibleYear(month.year);
    setVisibleMonth(month.month);
  }, []);

  // Navigate to detail
  const onFestivalPress = useCallback(
    (festivalId: string) => {
      navigation.navigate('FestivalDetail', { festivalId });
    },
    [navigation],
  );

  // Render each festival in the bottom list
  const renderFestivalItem = useCallback(
    ({ item }: { item: Festival }) => {
      const daysUntil = getDaysUntilFestival(item);
      return (
        <FestivalCard
          festival={item}
          daysUntil={daysUntil >= 0 ? daysUntil : undefined}
          onPress={() => onFestivalPress(item.id)}
        />
      );
    },
    [onFestivalPress],
  );

  const keyExtractor = useCallback((item: Festival) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Lunar info header */}
        <View style={styles.lunarHeader}>
          <Text style={styles.ganzhiText}>{lunarInfo.ganzhi}</Text>
          <Text style={styles.lunarDateText}>
            {lunarInfo.lunarMonthName}{lunarInfo.lunarDayName}
          </Text>
          {lunarInfo.solarTerm && (
            <View style={styles.solarTermBadge}>
              <Text style={styles.solarTermText}>{lunarInfo.solarTerm}</Text>
            </View>
          )}
        </View>

        {/* Calendar */}
        <Calendar
          current={effectiveDate}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
          enableSwipeMonths={true}
          markingType="multi-dot"
          markedDates={markedDates}
          theme={{
            calendarBackground: '#FBF7F0',
            textSectionTitleColor: '#888888',
            selectedDayBackgroundColor: '#C0392B',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#C0392B',
            dayTextColor: '#2C2C2C',
            textDisabledColor: '#CCCCCC',
            arrowColor: '#C0392B',
            monthTextColor: '#2C2C2C',
            textMonthFontWeight: '700',
            textDayFontSize: 15,
            textMonthFontSize: 17,
            textDayHeaderFontSize: 13,
          }}
          style={styles.calendar}
        />

        {/* Festival list for selected date */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {dayInfo.lunarDate}
              {dayInfo.solarTerm ? ` \u00B7 ${dayInfo.solarTerm}` : ''}
            </Text>
            <Text style={styles.listSubtitle}>
              {dayInfo.festivals.length > 0
                ? `${dayInfo.festivals.length} 个节日`
                : '暂无节日'}
            </Text>
          </View>

          <FlatList
            data={dayInfo.festivals}
            renderItem={renderFestivalItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>当日无节日活动</Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF7F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FBF7F0',
  },
  lunarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FBF7F0',
  },
  ganzhiText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C0392B',
    marginRight: 10,
  },
  lunarDateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C2C2C',
    marginRight: 10,
  },
  solarTermBadge: {
    backgroundColor: '#C0392B18',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  solarTermText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C0392B',
  },
  calendar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0DCD4',
  },
  listSection: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C2C2C',
  },
  listSubtitle: {
    fontSize: 13,
    color: '#888888',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
});
