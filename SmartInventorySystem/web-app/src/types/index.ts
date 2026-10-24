export type UserRole = 'Administrator' | 'InventoryManager' | 'StoreKeeper' | 'KitchenManager' | 'ProcurementOfficer' | 'FinanceOfficer' | 'Auditor' | 'Supplier';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Item {
  _id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  reorderLevel: number;
  reorderQuantity: number;
  currentStock: number;
  unitCost: number;
  sellingPrice?: number;
  supplierId?: string;
  warehouseId?: string;
  location?: string;
  expiryDate?: string;
  batchNumber?: string;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  location: string;
  address: string;
  city: string;
  capacity: number;
  managerName: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  _id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled';
  totalAmount: number;
  createdBy: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface GoodsReceived {
  _id: string;
  grnNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  supplierId: string;
  supplierName: string;
  receivedBy: string;
  receivedDate: string;
  items: GoodsReceivedItem[];
  totalAmount: number;
  status: 'Pending' | 'Completed' | 'Rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceivedItem {
  itemId: string;
  itemName: string;
  quantityReceived: number;
  unitCost: number;
  batchNumber?: string;
  expiryDate?: string;
  remarks?: string;
}

export interface GoodsIssued {
  _id: string;
  giNumber: string;
  issuedBy: string;
  issuedTo: string;
  issuedDate: string;
  items: GoodsIssuedItem[];
  totalValue: number;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsIssuedItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface StockTransfer {
  _id: string;
  stNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  items: StockTransferItem[];
  transferDate: string;
  status: 'Pending' | 'Approved' | 'In Transit' | 'Completed' | 'Cancelled';
  initiatedBy: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransferItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
}

export interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  expiringItems: number;
  totalSuppliers: number;
  pendingPOs: number;
  totalWarehouses: number;
  monthlyValue: number;
  monthlyItems: number;
}

export interface LowStockAlert {
  _id: string;
  itemId: string;
  itemName: string;
  currentStock: number;
  reorderLevel: number;
  supplierName?: string;
  unitCost: number;
  daysUntilStockout: number;
}

export interface ExpiryAlert {
  _id: string;
  itemId: string;
  itemName: string;
  batchNumber?: string;
  expiryDate: string;
  currentStock: number;
  daysUntilExpiry: number;
  supplierName?: string;
}

export interface AIRecommendation {
  _id: string;
  type: 'Reorder' | 'StockReduction' | 'SupplierChange' | 'PriceAdjustment';
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  itemId?: string;
  itemName?: string;
  suggestedAction: string;
  estimatedImpact: string;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface ReportData {
  period: string;
  totalItems: number;
  totalValue: number;
  itemsReceived: number;
  itemsIssued: number;
  lowStockCount: number;
  expiringCount: number;
  purchaseOrders: number;
  stockTransfers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
