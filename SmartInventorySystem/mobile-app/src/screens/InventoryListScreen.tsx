import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Searchbar, Chip, Portal, Modal, FAB, IconButton, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import InventoryCard from '../components/InventoryCard';
import { InventoryItem } from '../types';
import { APP_CONSTANTS, CATEGORY_OPTIONS } from '../utils/constants';

export default function InventoryListScreen() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
      setItems([
        {
          id: '1',
          sku: 'SKU-001-ELEC',
          name: 'Wireless Bluetooth Headphones',
          category: 'Electronics',
          quantity: 2450,
          unit: 'pcs',
          location: 'Warehouse A - A1',
          reorderLevel: 500,
          unitPrice: 45.99,
          lastRestocked: '2024-01-15',
          status: 'in_stock',
        },
        {
          id: '2',
          sku: 'SKU-002-RAW',
          name: 'Stainless Steel Sheets 304',
          category: 'Raw Materials',
          quantity: 120,
          unit: 'sheets',
          location: 'Warehouse B - B1',
          reorderLevel: 200,
          unitPrice: 128.50,
          lastRestocked: '2024-01-10',
          status: 'low_stock',
        },
        {
          id: '3',
          sku: 'SKU-003-PACK',
          name: 'Corrugated Shipping Boxes',
          category: 'Packaging',
          quantity: 0,
          unit: 'pcs',
          location: 'Warehouse A - A2',
          reorderLevel: 1000,
          unitPrice: 2.25,
          lastRestocked: '2023-12-20',
          status: 'out_of_stock',
        },
        {
          id: '4',
          sku: 'SKU-004-SAFE',
          name: 'Safety Helmets ANSI Rated',
          category: 'Safety Equipment',
          quantity: 450,
          unit: 'pcs',
          location: 'Warehouse C - C1',
          reorderLevel: 100,
          unitPrice: 18.75,
          lastRestocked: '2024-01-12',
          status: 'in_stock',
        },
        {
          id: '5',
          sku: 'SKU-005-ELEC',
          name: 'USB-C Cables 6ft',
          category: 'Electronics',
          quantity: 85,
          unit: 'pcs',
          location: 'Warehouse A - A1',
          reorderLevel: 300,
          unitPrice: 8.50,
          lastRestocked: '2024-01-08',
          status: 'low_stock',
        },
        {
          id: '6',
          sku: 'SKU-006-FINI',
          name: 'Industrial Lubricant 5L',
          category: 'Chemicals',
          quantity: 320,
          unit: 'liters',
          location: 'Cold Storage - CS1',
          reorderLevel: 100,
          unitPrice: 24.99,
          lastRestocked: '2024-01-14',
          status: 'in_stock',
        },
        {
          id: '7',
          sku: 'SKU-007-OFFI',
          name: 'Printer Paper A4 Box',
          category: 'Office Supplies',
          quantity: 180,
          unit: 'boxes',
          location: 'Warehouse A - A2',
          reorderLevel: 50,
          unitPrice: 12.99,
          lastRestocked: '2024-01-11',
          status: 'in_stock',
        },
        {
          id: '8',
          sku: 'SKU-008-MACH',
          name: 'Hydraulic Valve Assembly',
          category: 'Machinery Parts',
          quantity: 0,
          unit: 'pcs',
          location: 'Warehouse B - B2',
          reorderLevel: 25,
          unitPrice: 245.00,
          lastRestocked: '2023-11-28',
          status: 'out_of_stock',
        },
      ]);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleIssue = (item: InventoryItem) => {
    Alert.alert('Issue Item', `Issue stock for ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: () => console.log('Issue', item.id) },
    ]);
  };

  const handleReceive = (item: InventoryItem) => {
    Alert.alert('Receive Stock', `Receive stock for ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: () => console.log('Receive', item.id) },
    ]);
  };

  const getStatusFilterLabel = (status: string) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <Text style={styles.headerSubtitle}>{filteredItems.length} items found</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search items, SKU, or location..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={APP_CONSTANTS.THEME.PRIMARY}
          inputStyle={{ fontSize: 14 }}
        />
        <IconButton
          icon="tune"
          mode={selectedCategory || selectedStatus ? 'contained' : 'outlined'}
          size={20}
          onPress={() => setFilterVisible(true)}
          style={styles.filterButton}
        />
      </View>

      {selectedCategory && (
        <View style={styles.activeFilters}>
          <Chip
            mode="flat"
            onClose={() => setSelectedCategory(null)}
            style={styles.chip}
            textStyle={{ fontSize: 12 }}
          >
            {selectedCategory}
          </Chip>
        </View>
      )}

      {selectedStatus && (
        <View style={styles.activeFilters}>
          <Chip
            mode="flat"
            onClose={() => setSelectedStatus(null)}
            style={[styles.chip, { backgroundColor: (APP_CONSTANTS.THEME[selectedStatus.toUpperCase() as keyof typeof APP_CONSTANTS.THEME] || APP_CONSTANTS.THEME.PRIMARY) + '20' }]}
            textStyle={{ fontSize: 12 }}
          >
            {getStatusFilterLabel(selectedStatus)}
          </Chip>
        </View>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InventoryCard
            item={item}
            onIssue={handleIssue}
            onReceive={handleReceive}
          />
        )}
        refreshing={refreshing}
        onRefresh={loadInventoryData}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inventory-2" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Add Item', 'Add new inventory item')}
      />

      <Portal>
        <Modal
          visible={filterVisible}
          onDismiss={() => setFilterVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Filter Inventory</Text>

          <Text style={styles.filterLabel}>Category</Text>
          <View style={styles.chipContainer}>
            {CATEGORY_OPTIONS.map((category) => (
              <Chip
                key={category}
                mode={selectedCategory === category ? 'flat' : 'outlined'}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(
                  selectedCategory === category ? null : category
                )}
                style={styles.chip}
              >
                {category}
              </Chip>
            ))}
          </View>

          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.chipContainer}>
            {Object.values(APP_CONSTANTS.INVENTORY_STATUSES).map((status) => (
              <Chip
                key={status}
                mode={selectedStatus === status ? 'flat' : 'outlined'}
                selected={selectedStatus === status}
                onPress={() => setSelectedStatus(
                  selectedStatus === status ? null : status
                )}
                style={styles.chip}
              >
                {getStatusFilterLabel(status)}
              </Chip>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Button onPress={() => { setSelectedCategory(null); setSelectedStatus(null); }} mode="outlined">
              Clear
            </Button>
            <Button onPress={() => setFilterVisible(false)} mode="contained">
              Apply
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
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
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#f1f5f9',
  },
  filterButton: {
    margin: 0,
  },
  activeFilters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  chip: {
    height: 32,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: APP_CONSTANTS.THEME.PRIMARY,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
});
