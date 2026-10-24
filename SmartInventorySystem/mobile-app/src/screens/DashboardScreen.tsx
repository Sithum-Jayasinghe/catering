import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Title, ActivityIndicator, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import { APP_CONSTANTS } from '../utils/constants';

interface DashboardStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  todayIssues: number;
  todayReceives: number;
  pendingAlerts: number;
  activeShipments: number;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    todayIssues: 0,
    todayReceives: 0,
    pendingAlerts: 0,
    activeShipments: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1200));
      setStats({
        totalItems: 2486,
        totalValue: 145280,
        lowStockCount: 34,
        outOfStockCount: 12,
        todayIssues: 156,
        todayReceives: 89,
        pendingAlerts: 8,
        activeShipments: 5,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_CONSTANTS.THEME.PRIMARY} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Title style={styles.greeting}>Dashboard</Title>
          <Text style={styles.subtitle}>
            {user?.warehouseName || 'Main Warehouse'}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <MaterialIcons name="calendar-today" size={20} color="#64748b" />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Items"
            value={stats.totalItems.toLocaleString()}
            icon="inventory-2"
            color={APP_CONSTANTS.THEME.PRIMARY}
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatCard
            title="Total Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            icon="attach-money"
            color={APP_CONSTANTS.THEME.SUCCESS}
            trend={{ value: 3.1, isPositive: true }}
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockCount}
            icon="warning"
            color={APP_CONSTANTS.THEME.WARNING}
            subtitle="items need attention"
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStockCount}
            icon="remove-shopping-cart"
            color={APP_CONSTANTS.THEME.DANGER}
            subtitle="urgent restock"
          />
        </View>
      </View>

      <View style={styles.activityContainer}>
        <Title style={styles.sectionTitle}>Today's Activity</Title>
        <View style={styles.activityRow}>
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: APP_CONSTANTS.THEME.DANGER + '20' }]}>
              <MaterialIcons name="arrow-upward" size={20} color={APP_CONSTANTS.THEME.DANGER} />
            </View>
            <Text style={styles.activityValue}>{stats.todayIssues}</Text>
            <Text style={styles.activityLabel}>Issues</Text>
          </View>
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: APP_CONSTANTS.THEME.SUCCESS + '20' }]}>
              <MaterialIcons name="arrow-downward" size={20} color={APP_CONSTANTS.THEME.SUCCESS} />
            </View>
            <Text style={styles.activityValue}>{stats.todayReceives}</Text>
            <Text style={styles.activityLabel}>Receives</Text>
          </View>
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: APP_CONSTANTS.THEME.WARNING + '20' }]}>
              <MaterialIcons name="local-shipping" size={20} color={APP_CONSTANTS.THEME.WARNING} />
            </View>
            <Text style={styles.activityValue}>{stats.activeShipments}</Text>
            <Text style={styles.activityLabel}>Shipments</Text>
          </View>
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: APP_CONSTANTS.THEME.SECONDARY + '20' }]}>
              <MaterialIcons name="notifications" size={20} color={APP_CONSTANTS.THEME.SECONDARY} />
            </View>
            <Text style={styles.activityValue}>{stats.pendingAlerts}</Text>
            <Text style={styles.activityLabel}>Alerts</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Title style={styles.sectionTitle}>Quick Actions</Title>
        <View style={styles.quickActionsGrid}>
          <Button
            icon="qrcode-scan"
            mode="contained"
            onPress={() => {}}
            style={styles.quickActionButton}
          >
            Scan Item
          </Button>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  warehouse: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  activityLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#1e40af',
  },
  spacer: {
    height: 20,
  },
});
