import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton, Chip } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { InventoryItem } from '../types';
import { APP_CONSTANTS } from '../utils/constants';

interface InventoryCardProps {
  item: InventoryItem;
  onPress?: (item: InventoryItem) => void;
  onIssue?: (item: InventoryItem) => void;
  onReceive?: (item: InventoryItem) => void;
}

export default function InventoryCard({ item, onPress, onIssue, onReceive }: InventoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case APP_CONSTANTS.INVENTORY_STATUSES.IN_STOCK:
        return APP_CONSTANTS.THEME.SUCCESS;
      case APP_CONSTANTS.INVENTORY_STATUSES.LOW_STOCK:
        return APP_CONSTANTS.THEME.WARNING;
      case APP_CONSTANTS.INVENTORY_STATUSES.OUT_OF_STOCK:
        return APP_CONSTANTS.THEME.DANGER;
      default:
        return '#94a3b8';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case APP_CONSTANTS.INVENTORY_STATUSES.IN_STOCK:
        return 'In Stock';
      case APP_CONSTANTS.INVENTORY_STATUSES.LOW_STOCK:
        return 'Low Stock';
      case APP_CONSTANTS.INVENTORY_STATUSES.OUT_OF_STOCK:
        return 'Out of Stock';
      default:
        return status;
    }
  };

  const isLowStock = item.quantity <= item.reorderLevel;
  const unitPrice = item.unitPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card style={styles.card} onPress={() => onPress?.(item)}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.sku}>{item.sku}</Text>
          </View>
          <Chip
            mode="flat"
            textStyle={{ color: getStatusColor(item.status), fontSize: 11 }}
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
          >
            {getStatusLabel(item.status)}
          </Chip>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <MaterialIcons name="category" size={14} color="#64748b" />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={14} color="#64748b" />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={[
              styles.detailValue,
              isLowStock && styles.detailValueWarning,
            ]}>
              {item.quantity.toLocaleString()} {item.unit}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Unit Price</Text>
            <Text style={styles.detailValue}>${unitPrice}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Value</Text>
            <Text style={styles.detailValueBold}>
              ${(item.quantity * item.unitPrice).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {isLowStock && (
          <View style={styles.alertContainer}>
            <MaterialIcons name="warning" size={14} color={APP_CONSTANTS.THEME.WARNING} />
            <Text style={styles.alertText}>
              Low stock alert: Reorder level is {item.reorderLevel.toLocaleString()} {item.unit}
            </Text>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.issueButton]}
            onPress={() => onIssue?.(item)}
            disabled={item.status === APP_CONSTANTS.INVENTORY_STATUSES.OUT_OF_STOCK}
          >
            <MaterialIcons name="arrow-upward" size={16} color="#ffffff" />
            <Text style={styles.actionText}>Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.receiveButton]}
            onPress={() => onReceive?.(item)}
          >
            <MaterialIcons name="arrow-downward" size={16} color="#ffffff" />
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  sku: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusChip: {
    height: 26,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#475569',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  detailValueWarning: {
    color: APP_CONSTANTS.THEME.WARNING,
    fontWeight: '600',
  },
  detailValueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_CONSTANTS.THEME.WARNING + '15',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  alertText: {
    fontSize: 12,
    color: APP_CONSTANTS.THEME.WARNING,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  issueButton: {
    backgroundColor: APP_CONSTANTS.THEME.DANGER,
  },
  receiveButton: {
    backgroundColor: APP_CONSTANTS.THEME.SUCCESS,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
