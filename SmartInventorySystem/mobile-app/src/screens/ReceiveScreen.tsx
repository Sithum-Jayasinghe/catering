import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Title, Paragraph, TextInput, Button, Surface, Chip, Divider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScanButton from '../components/ScanButton';
import { APP_CONSTANTS, LOCATION_OPTIONS } from '../utils/constants';

export default function ReceiveScreen() {
  const [scannedCode, setScannedCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState(LOCATION_OPTIONS[0]);
  const [batchNumber, setBatchNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentReceives, setRecentReceives] = useState<
    { id: string; itemName: string; sku: string; quantity: number; timestamp: string }[]
  >([
    { id: '1', itemName: 'Bluetooth Speakers', sku: 'SKU-099-ELEC', quantity: 200, timestamp: '30 min ago' },
    { id: '2', itemName: 'Copper Wire Rolls', sku: 'SKU-100-RAW', quantity: 500, timestamp: '1 hour ago' },
    { id: '3', itemName: 'Packaging Tape', sku: 'SKU-101-PACK', quantity: 1000, timestamp: '2 hours ago' },
  ]);

  const handleScan = (result: { type: string; data: string; format: string }) => {
    setScannedCode(result.data);
  };

  const handleSubmit = async () => {
    if (!scannedCode) {
      Alert.alert('Validation Error', 'Please scan or enter an item code');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid quantity');
      return;
    }

    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    
    const newReceive = {
      id: Date.now().toString(),
      itemName: `Item ${scannedCode.slice(-4)}`,
      sku: scannedCode,
      quantity: Number(quantity),
      timestamp: 'Just now',
    };
    setRecentReceives((prev) => [newReceive, ...prev]);
    
    Alert.alert('Success', 'Stock received successfully', [
      { text: 'OK', onPress: () => resetForm() }
    ]);
    setLoading(false);
  };

  const resetForm = () => {
    setScannedCode('');
    setQuantity('');
    setBatchNumber('');
    setNotes('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Receive Stock</Title>
        <Paragraph style={styles.headerSubtitle}>
          Record incoming stock movement into inventory
        </Paragraph>
      </View>

      <Surface style={styles.formCard} elevation={2}>
        <Text style={styles.sectionLabel}>Item Identification</Text>
        <ScanButton onScan={handleScan} />

        <View style={styles.formGroup}>
          <MaterialIcons name="barcode" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            mode="outlined"
            label="Barcode / SKU"
            value={scannedCode}
            onChangeText={setScannedCode}
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="barcode" />}
          />
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.sectionLabel}>Quantity & Details</Text>

        <View style={styles.formGroup}>
          <MaterialIcons name="numbers" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            mode="outlined"
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
            left={<TextInput.Icon icon="numeric" />}
          />
        </View>

        <View style={styles.formGroup}>
          <MaterialIcons name="location-on" size={20} color="#64748b" style={styles.inputIcon} />
          <View style={styles.locationContainer}>
            {LOCATION_OPTIONS.map((loc) => (
              <Chip
                key={loc}
                mode={location === loc ? 'flat' : 'outlined'}
                selected={location === loc}
                onPress={() => setLocation(loc)}
                style={styles.chip}
                textStyle={{ fontSize: 11 }}
              >
                {loc}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <MaterialIcons name="tag" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            mode="outlined"
            label="Batch / Lot Number (optional)"
            value={batchNumber}
            onChangeText={setBatchNumber}
            autoCapitalize="characters"
            style={styles.input}
            left={<TextInput.Icon icon="tag" />}
          />
        </View>

        <View style={styles.formGroup}>
          <MaterialIcons name="notes" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            mode="outlined"
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
            left={<TextInput.Icon icon="text" />}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          buttonColor={APP_CONSTANTS.THEME.SUCCESS}
        >
          Receive Stock
        </Button>
      </Surface>

      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Receives</Text>
          <Button mode="text" onPress={() => {}}>View All</Button>
        </View>

        {recentReceives.map((receive) => (
          <Surface key={receive.id} style={styles.recentItem} elevation={1}>
            <View style={styles.recentIconContainer}>
              <MaterialIcons name="arrow-downward" size={20} color={APP_CONSTANTS.THEME.SUCCESS} />
            </View>
            <View style={styles.recentContent}>
              <Text style={styles.recentItemName}>{receive.itemName}</Text>
              <Text style={styles.recentItemSku}>{receive.sku}</Text>
              <Text style={styles.recentItemMeta}>
                Qty: {receive.quantity} • {receive.timestamp}
              </Text>
            </View>
          </Surface>
        ))}
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
  formCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: APP_CONSTANTS.THEME.SUCCESS,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 14,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 80,
  },
  divider: {
    marginVertical: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    height: 32,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  recentSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  recentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: APP_CONSTANTS.THEME.SUCCESS + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentContent: {
    flex: 1,
  },
  recentItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  recentItemSku: {
    fontSize: 12,
    color: '#94a3b8',
  },
  recentItemMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  spacer: {
    height: 24,
  },
});
