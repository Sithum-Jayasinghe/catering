import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Animated } from 'react-native';
import { Title, Button, Surface, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { APP_CONSTANTS } from '../utils/constants';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    data: string;
    format: string;
    timestamp: string;
  } | null>(null);
  const [scanHistory, setScanHistory] = useState<
    { data: string; format: string; timestamp: string }[]
  >([]);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const simulateScan = useCallback(() => {
    setScanning(true);
    setScanResult(null);

    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.15,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      const resultTimestamp = new Date().toLocaleString();
      const resultData = '690123456789' + Math.floor(Math.random() * 1000);
      setScanResult({
        data: resultData,
        format: 'EAN-13',
        timestamp: resultTimestamp,
      });
      setScanHistory((prev) => [
        { data: resultData, format: 'EAN-13', timestamp: resultTimestamp },
        ...prev.slice(0, 4),
      ]);
      setScanning(false);
    }, 2000);
  }, [pulseAnim]);

  const handleManualEntry = () => {
    Alert.prompt(
      'Enter Barcode/SKU',
      'Scan or manually enter the barcode or SKU number',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: (code) => {
            if (code) {
              const timestamp = new Date().toLocaleString();
              setScanResult({ data: code, format: 'Manual', timestamp });
              setScanHistory((prev) => [
                { data: code, format: 'Manual', timestamp },
                ...prev.slice(0, 4),
              ]);
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const clearHistory = () => {
    setScanResult(null);
    setScanHistory([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Scan</Title>
        <Text style={styles.headerSubtitle}>
          Scan barcodes or QR codes to identify items
        </Text>
      </View>

      <View style={styles.scannerContainer}>
        <View style={styles.scannerViewfinder}>
          <Animated.View
            style={[
              styles.scanAnimation,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <MaterialIcons
              name={scanning ? 'camera' : 'qr-code-scanner'}
              size={scanning ? 64 : 80}
              color={scanning ? APP_CONSTANTS.THEME.SECONDARY : APP_CONSTANTS.THEME.PRIMARY}
            />
          </Animated.View>

          <View style={styles.corners}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <Surface style={styles.scannerStatus} elevation={2}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: scanning ? APP_CONSTANTS.THEME.WARNING : APP_CONSTANTS.THEME.SUCCESS },
              ]}
            />
            <Text style={styles.statusText}>
              {scanning ? 'Scanning...' : 'Ready to scan'}
            </Text>
          </View>
        </Surface>

        <View style={styles.scannerActions}>
          <Button
            mode="contained"
            onPress={simulateScan}
            loading={scanning}
            disabled={scanning}
            icon="camera-alt"
            style={styles.scanButton}
            contentStyle={styles.scanButtonContent}
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleManualEntry}
            icon="keyboard"
            style={styles.manualButton}
          >
            Manual Entry
          </Button>
        </View>
      </View>

      {scanResult && (
        <Surface style={styles.resultCard} elevation={3}>
          <View style={styles.resultHeader}>
            <View style={styles.resultIconContainer}>
              <MaterialIcons name="check-circle" size={24} color={APP_CONSTANTS.THEME.SUCCESS} />
            </View>
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>Scan Successful</Text>
              <Text style={styles.resultTime}>{scanResult.timestamp}</Text>
            </View>
            <IconButton
              icon="close"
              size={20}
              onPress={() => setScanResult(null)}
            />
          </View>

          <View style={styles.resultBody}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Format:</Text>
              <Chip compact textStyle={{ fontSize: 12 }}>
                {scanResult.format}
              </Chip>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Code:</Text>
              <Text style={styles.resultCode}>{scanResult.data}</Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Search', 'Search inventory for this item')}
              icon="search"
              compact
              style={styles.resultButton}
            >
              Search
            </Button>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Receive', 'Receive this item')}
              icon="arrow-downward"
              compact
              style={styles.resultButton}
            >
              Receive
            </Button>
            <Button
              mode="contained"
              onPress={() => Alert.alert('Issue', 'Issue this item')}
              icon="arrow-upward"
              compact
              style={styles.resultButton}
            >
              Issue
            </Button>
          </View>
        </Surface>
      )}

      {scanHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Scans</Text>
            <IconButton icon="refresh" size={18} onPress={clearHistory} />
          </View>

          {scanHistory.map((scan, index) => (
            <Surface key={index} style={styles.historyItem} elevation={1}>
              <View style={styles.historyIconContainer}>
                <MaterialIcons
                  name={
                    scan.format === 'Manual'
                      ? 'keyboard'
                      : scan.format.includes('QR')
                        ? 'qr-code'
                        : 'barcode'
                  }
                  size={20}
                  color={APP_CONSTANTS.THEME.PRIMARY}
                />
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyCode} numberOfLines={1}>
                  {scan.data}
                </Text>
                <Text style={styles.historyMeta}>
                  {scan.format} • {scan.timestamp}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </Surface>
          ))}
        </View>
      )}
    </View>
  );
}

const Chip = ({ children, compact, style, textStyle }: { children: React.ReactNode; compact?: boolean; style?: any; textStyle?: any }) => (
  <View style={[{ backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }, style]}>
    <Text style={[{ fontSize: compact ? 11 : 13, color: '#334155', fontWeight: '500' }, textStyle]}>{children}</Text>
  </View>
);

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
  scannerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  scannerViewfinder: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 280,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scanAnimation: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  corners: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: APP_CONSTANTS.THEME.SECONDARY,
  },
  topLeft: {
    top: 20,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 20,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  scannerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  scannerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  scanButton: {
    flex: 1,
    backgroundColor: APP_CONSTANTS.THEME.PRIMARY,
    borderRadius: 10,
  },
  scanButtonContent: {
    paddingVertical: 8,
  },
  manualButton: {
    flex: 1,
    borderRadius: 10,
    borderColor: APP_CONSTANTS.THEME.PRIMARY,
  },
  resultCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: APP_CONSTANTS.THEME.SUCCESS + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  resultTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  resultBody: {
    padding: 16,
    gap: 10,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    width: 60,
  },
  resultCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  resultActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  resultButton: {
    flex: 1,
  },
  historyContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  historyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: APP_CONSTANTS.THEME.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  historyMeta: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
});
