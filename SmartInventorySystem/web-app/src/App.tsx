import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import Layout from '@/components/Layout';
import PrivateRoute from '@/components/PrivateRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Items from '@/pages/Inventory/Items';
import ItemDetail from '@/pages/Inventory/ItemDetail';
import CreateItem from '@/pages/Inventory/CreateItem';
import GoodsReceived from '@/pages/Document/GoodsReceived';
import PurchaseOrders from '@/pages/Document/PurchaseOrders';
import GoodsIssued from '@/pages/Document/GoodsIssued';
import StockTransfer from '@/pages/Document/StockTransfer';
import Analytics from '@/pages/Reports/Analytics';
import Reports from '@/pages/Reports/Reports';
import Users from '@/pages/Admin/Users';
import Suppliers from '@/pages/Admin/Suppliers';
import Warehouses from '@/pages/Admin/Warehouses';
import Chatbot from '@/pages/AI/Chatbot';
import Recommendations from '@/pages/AI/Recommendations';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="inventory/items" element={<Items />} />
              <Route path="inventory/items/:id" element={<ItemDetail />} />
              <Route path="inventory/create" element={<CreateItem />} />
              <Route path="documents/goods-received" element={<GoodsReceived />} />
              <Route path="documents/purchase-orders" element={<PurchaseOrders />} />
              <Route path="documents/goods-issued" element={<GoodsIssued />} />
              <Route path="documents/stock-transfers" element={<StockTransfer />} />
              <Route path="reports/analytics" element={<Analytics />} />
              <Route path="reports/reports" element={<Reports />} />
              <Route path="admin/users" element={<Users />} />
              <Route path="admin/suppliers" element={<Suppliers />} />
              <Route path="admin/warehouses" element={<Warehouses />} />
              <Route path="ai/chatbot" element={<Chatbot />} />
              <Route path="ai/recommendations" element={<Recommendations />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
