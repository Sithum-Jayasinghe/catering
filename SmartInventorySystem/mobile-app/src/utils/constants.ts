export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.smartinventory.com/api';

export const APP_CONSTANTS = {
  APP_NAME: 'Smart Inventory',
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
  REFRESH_TOKEN_KEY: 'refresh_token',
  
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  
  SCAN_SETTINGS: {
    SUPPORTED_FORMATS: ['ean13', 'ean8', 'qr', 'code128', 'code39', 'upc_a', 'upc_e'],
    DEBOUNCE_MS: 500,
  },
  
  THEME: {
    PRIMARY: '#1e40af',
    SECONDARY: '#3b82f6',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    BACKGROUND: '#f8fafc',
    SURFACE: '#ffffff',
  },
  
  INVENTORY_STATUSES: {
    IN_STOCK: 'in_stock',
    LOW_STOCK: 'low_stock',
    OUT_OF_STOCK: 'out_of_stock',
  },
  
  MOVEMENT_TYPES: {
    ISSUE: 'issue',
    RECEIVE: 'receive',
  },
  
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff',
  },
};

export const LOCATION_OPTIONS = [
  'Warehouse A - A1',
  'Warehouse A - A2',
  'Warehouse A - B1',
  'Warehouse B - B1',
  'Warehouse B - B2',
  'Warehouse C - C1',
  'Cold Storage - CS1',
  'Loading Dock - LD1',
];

export const CATEGORY_OPTIONS = [
  'Electronics',
  'Raw Materials',
  'Finished Goods',
  'Packaging',
  'Safety Equipment',
  'Office Supplies',
  'Machinery Parts',
  'Chemicals',
  'Textiles',
  'Food & Beverage',
];

export const UNIT_OPTIONS = [
  'pcs',
  'kg',
  'lbs',
  'liters',
  'meters',
  'boxes',
  'pallets',
  'cases',
];
