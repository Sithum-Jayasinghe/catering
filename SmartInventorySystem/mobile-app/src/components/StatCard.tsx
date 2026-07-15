import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import MaterialIcons, { glyphMap } from 'react-native-vector-icons/MaterialIcons';
import { APP_CONSTANTS } from '../utils/constants';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof glyphMap;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color, trend, subtitle }: StatCardProps) {
  const theme = useTheme();

  const cardColor = color || theme.colors.primary;

  const trendColor = trend?.isPositive
    ? APP_CONSTANTS.THEME.SUCCESS
    : APP_CONSTANTS.THEME.DANGER;

  const trendIcon = trend?.isPositive ? 'arrow-upward' : 'arrow-downward';

  return (
    <View style={[styles.container, { borderLeftColor: cardColor }]}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, { backgroundColor: cardColor }]}>
          <MaterialIcons name={icon} size={24} color="#ffffff" />
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>{subtitle}</Text>}
        
        {trend && (
          <View style={styles.trendContainer}>
            <MaterialIcons name={trendIcon} size={14} color={trendColor} />
            <Text style={[styles.trendText, { color: trendColor }]}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    elevation: 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    gap: 2,
  },
  title: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
