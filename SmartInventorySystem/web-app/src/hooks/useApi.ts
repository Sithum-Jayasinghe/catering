import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ApiResponse, PaginationParams } from '@/types';

// api.getXxx() already unwraps axios and returns ApiResponse<T> directly.
// We return that ApiResponse so callers can access .data and .pagination.

export function useItems(params?: PaginationParams) {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['items', params],
    queryFn: () => api.getItems(params),
  });
}

export function useItem(id: string) {
  return useQuery<ApiResponse<any>>({
    queryKey: ['items', id],
    queryFn: () => api.getItem(id),
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
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['suppliers', params],
    queryFn: () => api.getSuppliers(params),
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
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['warehouses', params],
    queryFn: () => api.getWarehouses(params),
  });
}

export function useDashboardStats() {
  return useQuery<ApiResponse<any>>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.getDashboardStats(),
  });
}

export function useLowStockAlerts() {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['dashboard', 'low-stock'],
    queryFn: () => api.getLowStockAlerts(),
  });
}

export function useExpiryAlerts() {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['dashboard', 'expiry-alerts'],
    queryFn: () => api.getExpiryAlerts(),
  });
}

export function usePurchaseOrders(params?: PaginationParams) {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['purchase-orders', params],
    queryFn: () => api.getPurchaseOrders(params),
  });
}

export function useGoodsReceived(params?: PaginationParams) {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['goods-received', params],
    queryFn: () => api.getGoodsReceived(params),
  });
}

export function useGoodsIssued(params?: PaginationParams) {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['goods-issued', params],
    queryFn: () => api.getGoodsIssued(params),
  });
}

export function useStockTransfers(params?: PaginationParams) {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['stock-transfers', params],
    queryFn: () => api.getStockTransfers(params),
  });
}

export function useUsers(params?: PaginationParams) {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['users', params],
    queryFn: () => api.getUsers(params),
  });
}

export function useChatWithAI() {
  return useMutation({
    mutationFn: ({ message, context }: { message: string; context?: Record<string, any> }) =>
      api.chatWithAI(message, context),
  });
}

export function useRecommendations() {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['ai', 'recommendations'],
    queryFn: () => api.getRecommendations(),
  });
}

export function useAnalytics(params?: { startDate?: string; endDate?: string }) {
  return useQuery<ApiResponse<any>>({
    queryKey: ['reports', 'analytics', params],
    queryFn: () => api.getAnalytics(params),
  });
}
