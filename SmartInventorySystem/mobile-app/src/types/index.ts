export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  warehouseId: string;
  warehouseName: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  reorderLevel: number;
  unitPrice: number;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image?: string;
}

export interface ScanResult {
  type: 'barcode' | 'qr';
  data: string;
  format: string;
}

export interface AIInsight {
  id: string;
  type: 'reorder' | 'forecast' | 'anomaly' | 'suggestion';
  message: string;
  priority: 'high' | 'medium' | 'low';
  itemId?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ReportData {
  id: string;
  type: 'summary' | 'movement' | 'valuation' | 'aging';
  title: string;
  data: Record<string, unknown>;
  generatedAt: string;
}

export interface MovementRecord {
  id: string;
  itemId: string;
  itemName: string;
  type: 'issue' | 'receive';
  quantity: number;
  location: string;
  userId: string;
  userName: string;
  reference: string;
  notes?: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
