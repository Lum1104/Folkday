import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Custom } from '../types';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CustomItemProps {
  custom: Custom;
  index: number;
}

export default function CustomItem({ custom, index }: CustomItemProps) {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        250,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );

    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    setExpanded(!expanded);
  };

  const chevronRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const hasDetails =
    !!custom.description || !!custom.timing || (custom.preparations && custom.preparations.length > 0);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleExpand}
      activeOpacity={0.7}
      disabled={!hasDetails}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.indexCircle}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <Text style={styles.title} numberOfLines={expanded ? undefined : 1}>
          {custom.title}
        </Text>
        {hasDetails && (
          <Animated.Text
            style={[
              styles.chevron,
              { transform: [{ rotate: chevronRotation }] },
            ]}
          >
            {'\u203A'}
          </Animated.Text>
        )}
      </View>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.body}>
          {/* Description */}
          {custom.description ? (
            <Text style={styles.description}>{custom.description}</Text>
          ) : null}

          {/* Timing */}
          {custom.timing ? (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>时间</Text>
              <Text style={styles.metaValue}>{custom.timing}</Text>
            </View>
          ) : null}

          {/* Preparations */}
          {custom.preparations && custom.preparations.length > 0 && (
            <View style={styles.prepSection}>
              <Text style={styles.metaLabel}>准备事项</Text>
              {custom.preparations.map((item, i) => (
                <View key={i} style={styles.prepRow}>
                  <Text style={styles.prepBullet}>{'\u2022'}</Text>
                  <Text style={styles.prepText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  indexCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FBF7F0',
    borderWidth: 1,
    borderColor: '#D4A574',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  indexText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D4A574',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#2C2C2C',
  },
  chevron: {
    fontSize: 20,
    color: '#B0B0B0',
    marginLeft: 8,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0ECE4',
    marginTop: -2,
  },
  description: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 21,
    marginTop: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D4A574',
    marginRight: 8,
  },
  metaValue: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  prepSection: {
    marginTop: 10,
  },
  prepRow: {
    flexDirection: 'row',
    marginTop: 5,
    paddingLeft: 4,
  },
  prepBullet: {
    fontSize: 13,
    color: '#D4A574',
    marginRight: 6,
    lineHeight: 20,
  },
  prepText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    flex: 1,
  },
});
