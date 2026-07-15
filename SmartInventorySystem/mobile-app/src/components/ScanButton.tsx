import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { APP_CONSTANTS } from '../utils/constants';

interface ScanButtonProps {
  onScan: (result: { type: string; data: string; format: string }) => void;
  disabled?: boolean;
  label?: string;
  variant?: 'primary' | 'secondary';
}

export default function ScanButton({
  onScan,
  disabled = false,
  label = 'Scan Barcode',
  variant = 'primary',
}: ScanButtonProps) {
  const [visible, setVisible] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const backgroundColor = variant === 'primary' ? APP_CONSTANTS.THEME.PRIMARY : '#ffffff';
  const textColor = variant === 'primary' ? '#ffffff' : APP_CONSTANTS.THEME.PRIMARY;

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan({
        type: 'barcode',
        data: manualCode.trim(),
        format: 'manual',
      });
      setManualCode('');
      setVisible(false);
    }
  };

  const handleSimulatedScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const simulatedData = '6901234567890';
      onScan({
        type: 'barcode',
        data: simulatedData,
        format: 'ean13',
      });
      setIsScanning(false);
      setVisible(false);
    }, 1500);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.container, { backgroundColor }]}
        onPress={() => setVisible(true)}
        disabled={disabled || isScanning}
        activeOpacity={0.8}
      >
        <MaterialIcons name="qr-code-scanner" size={24} color={textColor} />
        <Text style={[styles.text, { color: textColor }]}>{isScanning ? 'Scanning...' : label}</Text>
      </TouchableOpacity>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Scan Item</Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogContent}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleSimulatedScan}
                disabled={isScanning}
              >
                <MaterialIcons name="camera-alt" size={32} color={APP_CONSTANTS.THEME.PRIMARY} />
                <Text style={styles.optionText}>
                  {isScanning ? 'Scanning...' : 'Camera Scan'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <Text style={styles.dividerText}>or</Text>
              </View>

              <View style={styles.manualInput}>
                <TextInput
                  mode="outlined"
                  label="Enter barcode/SKU manually"
                  value={manualCode}
                  onChangeText={setManualCode}
                  autoCapitalize="none"
                  autoCorrect={false}
                  left={<TextInput.Icon icon="barcode" />}
                />
                <Button
                  mode="contained"
                  onPress={handleManualSubmit}
                  disabled={!manualCode.trim()}
                  style={styles.submitButton}
                >
                  Submit
                </Button>
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  dialogContent: {
    alignItems: 'center',
    gap: 16,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    width: '100%',
    gap: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dividerText: {
    color: '#94a3b8',
    fontSize: 12,
    paddingHorizontal: 12,
  },
  manualInput: {
    width: '100%',
    gap: 12,
  },
  submitButton: {
    marginTop: 4,
  },
});
