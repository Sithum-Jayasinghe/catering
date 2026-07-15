import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Linking } from 'react-native';
import { Title, Paragraph, Switch as PaperSwitch, Divider, List, Surface, IconButton, Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { APP_CONSTANTS } from '../utils/constants';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [movementAlerts, setMovementAlerts] = useState(false);
  const [dailyReports, setDailyReports] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will clear cached data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully') },
    ]);
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Settings</Title>
        <Paragraph style={styles.headerSubtitle}>
          Manage your preferences and account
        </Paragraph>
      </View>

      <Surface style={styles.profileCard} elevation={3}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="account-circle" size={64} color={APP_CONSTANTS.THEME.PRIMARY} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileRole}>Warehouse Manager</Text>
            <Text style={styles.profileWarehouse}>Main Distribution Center</Text>
          </View>
        </View>
      </Surface>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Surface style={styles.sectionCard} elevation={1}>
          <List.Item
            title="Enable Notifications"
            description="Receive push notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <PaperSwitch
                value={notifications}
                onValueChange={setNotifications}
                color={APP_CONSTANTS.THEME.PRIMARY}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Low Stock Alerts"
            description="Alert when items drop below reorder level"
            left={(props) => <List.Icon {...props} icon="warning" />}
            right={() => (
              <PaperSwitch
                value={lowStockAlerts}
                onValueChange={setLowStockAlerts}
                color={APP_CONSTANTS.THEME.PRIMARY}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Movement Alerts"
            description="Alert on new stock movements"
            left={(props) => <List.Icon {...props} icon="swap-horiz" />}
            right={() => (
              <PaperSwitch
                value={movementAlerts}
                onValueChange={setMovementAlerts}
                color={APP_CONSTANTS.THEME.PRIMARY}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Daily Reports"
            description="Receive daily summary reports via email"
            left={(props) => <List.Icon {...props} icon="email" />}
            right={() => (
              <PaperSwitch
                value={dailyReports}
                onValueChange={setDailyReports}
                color={APP_CONSTANTS.THEME.PRIMARY}
              />
            )}
          />
        </Surface>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance & Behavior</Text>
        <Surface style={styles.sectionCard} elevation={1}>
          <List.Item
            title="Dark Mode"
            description="Use dark theme throughout the app"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <PaperSwitch
                value={darkMode}
                onValueChange={setDarkMode}
                color={APP_CONSTANTS.THEME.PRIMARY}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Offline Mode"
            description="Enable offline data access"
            left={(props) => <List.Icon {...props} icon="cloud-off" />}
            right={() => (
              <PaperSwitch
                value={offlineMode}
                onValueChange={setOfflineMode}
                color={APP_CONSTANTS.THEME.PRIMARY}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Biometric Login"
            description="Use fingerprint or face recognition"
            left={(props) => <List.Icon {...props} icon="fingerprint" />}
            right={() => (
              <PaperSwitch
                value={biometric}
                onValueChange={setBiometric}
                color={APP_CONSTANTS.THEME.PRIMARY}
              />
            )}
          />
        </Surface>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        <Surface style={styles.sectionCard} elevation={1}>
          <List.Item
            title="Clear Cache"
            description="Free up storage space"
            left={(props) => <List.Icon {...props} icon="delete-sweep" />}
            right={(props) => (
              <IconButton {...props} icon="chevron-right" onPress={handleClearCache} />
            )}
          />
          <Divider />
          <List.Item
            title="Export Data"
            description="Export inventory data"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => (
              <IconButton {...props} icon="chevron-right" onPress={() => Alert.alert('Export', 'Export functionality')} />
            )}
          />
        </Surface>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Surface style={styles.sectionCard} elevation={1}>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => (
              <IconButton {...props} icon="open-in-new" onPress={() => openLink('https://example.com/terms')} />
            )}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => (
              <IconButton {...props} icon="open-in-new" onPress={() => openLink('https://example.com/privacy')} />
            )}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => (
              <IconButton {...props} icon="chevron-right" onPress={() => Alert.alert('Support', 'Support contact')} />
            )}
          />
        </Surface>
      </View>

      <View style={styles.logoutSection}>
        <Button
          mode="contained"
          onPress={handleLogout}
          buttonColor={APP_CONSTANTS.THEME.DANGER}
          style={styles.logoutButton}
          contentStyle={styles.logoutButtonContent}
          icon="logout"
        >
          Logout
        </Button>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {APP_CONSTANTS.APP_NAME} v1.0.0
        </Text>
        <Text style={styles.footerText}>Enterprise Edition</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  profileRole: {
    fontSize: 14,
    color: APP_CONSTANTS.THEME.PRIMARY,
    fontWeight: '600',
    marginTop: 2,
  },
  profileWarehouse: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  sectionCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  logoutButton: {
    borderRadius: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  spacer: {
    height: 32,
  },
});
