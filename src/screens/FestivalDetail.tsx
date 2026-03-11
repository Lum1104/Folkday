// src/screens/FestivalDetail.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { getFestivalById } from '../data';
import { getDaysUntilFestival } from '../services/festivalService';
import { getFestivalSolarDate } from '../services/lunarService';
import { REGION_LIST } from '../types';
import CountdownBadge from '../components/CountdownBadge';
import CustomItem from '../components/CustomItem';

const REGION_COLORS: Record<string, string> = {
  chaoshan: '#C0392B',
  minnan: '#E67E22',
  guangfu: '#D4A017',
  kejia: '#27826B',
};

const IMPORTANCE_LABELS: Record<string, string> = {
  high: '重要',
  medium: '一般',
  low: '次要',
};

const IMPORTANCE_COLORS: Record<string, string> = {
  high: '#C0392B',
  medium: '#D4A574',
  low: '#B0B0B0',
};

const CALENDAR_TYPE_LABELS: Record<string, string> = {
  lunar: '农历',
  solar: '公历',
  solarTerm: '节气',
};

interface FestivalDetailProps {
  route: {
    params: {
      festivalId: string;
    };
  };
  navigation: any;
}

export default function FestivalDetail({ route, navigation }: FestivalDetailProps) {
  const { festivalId } = route.params;
  const festival = useMemo(() => getFestivalById(festivalId), [festivalId]);

  if (!festival) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>未找到该节日信息</Text>
        </View>
      </SafeAreaView>
    );
  }

  const daysUntil = getDaysUntilFestival(festival);
  const region = REGION_LIST.find(r => r.id === festival.region);
  const regionColor = REGION_COLORS[festival.region] || '#C0392B';
  const importanceColor = IMPORTANCE_COLORS[festival.importance] || '#B0B0B0';
  const importanceLabel = IMPORTANCE_LABELS[festival.importance] || festival.importance;
  const calendarTypeLabel = CALENDAR_TYPE_LABELS[festival.calendarType] || festival.calendarType;

  // Resolve the solar date for this year
  const currentYear = new Date().getFullYear();
  const solarDate = getFestivalSolarDate(currentYear, {
    calendarType: festival.calendarType,
    date: festival.date,
  });

  // Format the lunar date string
  const lunarDateStr = festival.calendarType === 'solarTerm'
    ? festival.date.solarTerm || ''
    : `${calendarTypeLabel} ${festival.date.month}月${festival.date.day}日`;

  // Format the resolved solar date
  const solarDateStr = solarDate
    ? `${solarDate.year}年${solarDate.month}月${solarDate.day}日`
    : '日期未确定';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Name + Countdown */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text style={styles.festivalName}>{festival.name}</Text>
            {daysUntil >= 0 && <CountdownBadge daysUntil={daysUntil} />}
          </View>

          {/* Tags: region + importance */}
          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: regionColor + '18' }]}>
              <Text style={[styles.tagText, { color: regionColor }]}>
                {region?.name ?? festival.region}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: importanceColor + '18' }]}>
              <Text style={[styles.tagText, { color: importanceColor }]}>
                {importanceLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Date info */}
        <View style={styles.dateSection}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>{calendarTypeLabel}日期</Text>
            <Text style={styles.dateValue}>{lunarDateStr}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>公历日期</Text>
            <Text style={styles.dateValue}>{solarDateStr}</Text>
          </View>
        </View>

        {/* Description */}
        {festival.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>简介</Text>
            <Text style={styles.descriptionText}>{festival.description}</Text>
          </View>
        ) : null}

        {/* Customs */}
        {festival.customs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              民俗活动 ({festival.customs.length})
            </Text>
            <View style={styles.customsList}>
              {festival.customs.map((custom, index) => (
                <CustomItem key={index} custom={custom} index={index} />
              ))}
            </View>
          </View>
        )}

        {/* Tags */}
        {festival.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>标签</Text>
            <View style={styles.tagsContainer}>
              {festival.tags.map((tag, index) => (
                <View key={index} style={styles.chipTag}>
                  <Text style={styles.chipTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF7F0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#888888',
  },

  // Header
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  festivalName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2C2C2C',
    flex: 1,
    marginRight: 12,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Date section
  dateSection: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C2C2C',
  },

  // Sections
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 24,
  },
  customsList: {
    marginHorizontal: -16,
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipTag: {
    backgroundColor: '#F0ECE4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipTagText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
});
