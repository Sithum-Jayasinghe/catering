import axios from 'axios';
import { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await apiClient.post<ApiResponse<{ user: any; token: string }>>('/auth/login', credentials);
    return data;
  },

  getProfile: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>('/auth/profile');
    return data;
  },

  // Items
  getItems: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/items', { params });
    return data;
  },

  getItem: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/items/${id}`);
    return data;
  },

  createItem: async (item: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/items', item);
    return data;
  },

  updateItem: async (id: string, item: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/items/${id}`, item);
    return data;
  },

  deleteItem: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/items/${id}`);
    return data;
  },

  semanticSearch: async (query: string) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/items/search/semantic', { params: { q: query } });
    return data;
  },

  // Suppliers
  getSuppliers: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/suppliers', { params });
    return data;
  },

  getSupplier: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/suppliers/${id}`);
    return data;
  },

  createSupplier: async (supplier: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/suppliers', supplier);
    return data;
  },

  updateSupplier: async (id: string, supplier: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/suppliers/${id}`, supplier);
    return data;
  },

  deleteSupplier: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/suppliers/${id}`);
    return data;
  },

  // Warehouses
  getWarehouses: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/warehouses', { params });
    return data;
  },

  getWarehouse: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/warehouses/${id}`);
    return data;
  },

  createWarehouse: async (warehouse: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/warehouses', warehouse);
    return data;
  },

  updateWarehouse: async (id: string, warehouse: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/warehouses/${id}`, warehouse);
    return data;
  },

  deleteWarehouse: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/warehouses/${id}`);
    return data;
  },

  // Purchase Orders
  getPurchaseOrders: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/purchase-orders', { params });
    return data;
  },

  getPurchaseOrder: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/purchase-orders/${id}`);
    return data;
  },

  createPurchaseOrder: async (po: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/purchase-orders', po);
    return data;
  },

  updatePurchaseOrder: async (id: string, po: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/purchase-orders/${id}`, po);
    return data;
  },

  approvePurchaseOrder: async (id: string) => {
    const { data } = await apiClient.post<ApiResponse<any>>(`/purchase-orders/${id}/approve`);
    return data;
  },

  // Goods Received
  getGoodsReceived: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/goods-received', { params });
    return data;
  },

  getGoodsReceivedById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/goods-received/${id}`);
    return data;
  },

  createGoodsReceived: async (gr: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/goods-received', gr);
    return data;
  },

  // Goods Issued
  getGoodsIssued: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/goods-issues', { params });
    return data;
  },

  getGoodsIssuedById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/goods-issues/${id}`);
    return data;
  },

  createGoodsIssued: async (gi: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/goods-issues', gi);
    return data;
  },

  // Stock Transfers
  getStockTransfers: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/stock-transfers', { params });
    return data;
  },

  getStockTransfer: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/stock-transfers/${id}`);
    return data;
  },

  createStockTransfer: async (st: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/stock-transfers', st);
    return data;
  },

  approveStockTransfer: async (id: string) => {
    const { data } = await apiClient.post<ApiResponse<any>>(`/stock-transfers/${id}/approve`);
    return data;
  },

  // Dashboard
  getDashboardStats: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>('/dashboard/stats');
    return data;
  },

  getLowStockAlerts: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/dashboard/low-stock');
    return data;
  },

  getExpiryAlerts: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/dashboard/expiry-alerts');
    return data;
  },

  // Reports
  getAnalytics: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any>>('/reports/analytics', { params });
    return data;
  },

  getReports: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any>>('/reports', { params });
    return data;
  },

  // Users
  getUsers: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/users', { params });
    return data;
  },

  createUser: async (user: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/users', user);
    return data;
  },

  updateUser: async (id: string, user: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/users/${id}`, user);
    return data;
  },

  deleteUser: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    return data;
  },

  // AI
  getRecommendations: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/ai/recommendations');
    return data;
  },

  chatWithAI: async (message: string, context?: Record<string, any>) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/ai/chat', { message, context });
    return data;
  },
};

export default apiClient;
