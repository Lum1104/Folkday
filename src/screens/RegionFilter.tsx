// src/screens/RegionFilter.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { REGION_LIST, RegionId } from '../types';
import { getFestivalsByRegion } from '../data';

const REGION_COLORS: Record<RegionId, string> = {
  chaoshan: '#C0392B',
  minnan: '#E67E22',
  guangfu: '#D4A017',
  kejia: '#27826B',
};

export default function RegionFilter() {
  const { state, dispatch } = useAppContext();
  const { selectedRegions } = state.preferences;
  const insets = useSafeAreaInsets();

  const handleToggle = (regionId: RegionId) => {
    dispatch({ type: 'TOGGLE_REGION', payload: regionId });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.title}>选择关注的地区</Text>
      <Text style={styles.subtitle}>
        仅已选地区的节日会显示在日历中，可随时更改
      </Text>

      {REGION_LIST.map(region => {
        const isSelected = selectedRegions.includes(region.id);
        const color = REGION_COLORS[region.id];
        const festivalCount = getFestivalsByRegion(region.id).length;

        return (
          <TouchableOpacity
            key={region.id}
            style={[
              styles.regionCard,
              isSelected && {
                borderColor: color,
                backgroundColor: color + '10',
              },
            ]}
            onPress={() => handleToggle(region.id)}
            activeOpacity={0.7}
          >
            <View style={styles.regionHeader}>
              <View style={styles.regionInfo}>
                <Text style={[styles.regionName, { color: isSelected ? color : '#333' }]}>
                  {region.name}
                </Text>
                <Text style={styles.regionDesc}>{region.description}</Text>
                <Text style={styles.festivalCount}>
                  {festivalCount} 个传统节日
                </Text>
              </View>

              <View
                style={[
                  styles.checkbox,
                  isSelected
                    ? { backgroundColor: color, borderColor: color }
                    : { borderColor: '#CCC' },
                ]}
              >
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    lineHeight: 20,
  },
  regionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  regionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  regionInfo: {
    flex: 1,
    marginRight: 12,
  },
  regionName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  regionDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  festivalCount: {
    fontSize: 12,
    color: '#999',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
