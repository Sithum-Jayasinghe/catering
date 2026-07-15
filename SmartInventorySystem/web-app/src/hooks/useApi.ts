import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { PaginationParams } from '@/types';

export function useItems(params?: PaginationParams) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: async () => {
      const response = await api.getItems(params);
      return response.data;
    },
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['items', id],
    queryFn: async () => {
      const response = await api.getItem(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useSuppliers(params?: PaginationParams) {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: async () => {
      const response = await api.getSuppliers(params);
      return response.data;
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export function useWarehouses(params?: PaginationParams) {
  return useQuery({
    queryKey: ['warehouses', params],
    queryFn: async () => {
      const response = await api.getWarehouses(params);
      return response.data;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.getDashboardStats();
      return response.data;
    },
  });
}

export function useLowStockAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'low-stock'],
    queryFn: async () => {
      const response = await api.getLowStockAlerts();
      return response.data;
    },
  });
}

export function useExpiryAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'expiry-alerts'],
    queryFn: async () => {
      const response = await api.getExpiryAlerts();
      return response.data;
    },
  });
}

export function usePurchaseOrders(params?: PaginationParams) {
  return useQuery({
    queryKey: ['purchase-orders', params],
    queryFn: async () => {
      const response = await api.getPurchaseOrders(params);
      return response.data;
    },
  });
}

export function useGoodsReceived(params?: PaginationParams) {
  return useQuery({
    queryKey: ['goods-received', params],
    queryFn: async () => {
      const response = await api.getGoodsReceived(params);
      return response.data;
    },
  });
}

export function useGoodsIssued(params?: PaginationParams) {
  return useQuery({
    queryKey: ['goods-issued', params],
    queryFn: async () => {
      const response = await api.getGoodsIssued(params);
      return response.data;
    },
  });
}

export function useStockTransfers(params?: PaginationParams) {
  return useQuery({
    queryKey: ['stock-transfers', params],
    queryFn: async () => {
      const response = await api.getStockTransfers(params);
      return response.data;
    },
  });
}

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await api.getUsers(params);
      return response.data;
    },
  });
}

export function useChatWithAI() {
  return useMutation({
    mutationFn: ({ message, context }: { message: string; context?: Record<string, any> }) => api.chatWithAI(message, context),
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ['ai', 'recommendations'],
    queryFn: async () => {
      const response = await api.getRecommendations();
      return response.data;
    },
  });
}

export function useAnalytics(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['reports', 'analytics', params],
    queryFn: async () => {
      const response = await api.getAnalytics(params);
      return response.data;
    },
  });
}
