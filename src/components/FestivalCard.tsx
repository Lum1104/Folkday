import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Festival, REGION_LIST } from '../types';
import CountdownBadge from './CountdownBadge';

const REGION_COLORS: Record<string, string> = {
  chaoshan: '#C0392B',
  minnan: '#E67E22',
  guangfu: '#D4A017',
  kejia: '#27826B',
};

const IMPORTANCE_COLORS: Record<string, string> = {
  high: '#C0392B',
  medium: '#D4A574',
  low: '#B0B0B0',
};

interface FestivalCardProps {
  festival: Festival;
  daysUntil?: number;
  onPress: () => void;
}

export default function FestivalCard({
  festival,
  daysUntil,
  onPress,
}: FestivalCardProps) {
  const region = REGION_LIST.find((r) => r.id === festival.region);
  const regionColor = REGION_COLORS[festival.region] || '#C0392B';
  const importanceColor = IMPORTANCE_COLORS[festival.importance] || '#B0B0B0';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header row: festival name + countdown */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View
            style={[styles.importanceDot, { backgroundColor: importanceColor }]}
          />
          <Text style={styles.name} numberOfLines={1}>
            {festival.name}
          </Text>
        </View>
        {daysUntil !== undefined && <CountdownBadge daysUntil={daysUntil} />}
      </View>

      {/* Region tag */}
      <View style={styles.tagRow}>
        <View style={[styles.regionTag, { backgroundColor: regionColor + '18' }]}>
          <Text style={[styles.regionText, { color: regionColor }]}>
            {region?.name ?? festival.region}
          </Text>
        </View>
      </View>

      {/* Description */}
      {festival.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {festival.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  importanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2C2C2C',
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  regionTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  regionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 10,
  },
});
