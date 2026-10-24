import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  LocalOffer as OfferIcon,
  ShoppingCart as CartIcon,
  Business as BusinessIcon,
  Warehouse as WarehouseIcon,
  TrendingUp as TrendingIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useDashboardStats, useLowStockAlerts, useExpiryAlerts } from '@/hooks/useApi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

export default function Dashboard() {
  const { data: statsResponse, isLoading: statsLoading } = useDashboardStats();
  const { data: lowStockResponse, isLoading: alertsLoading } = useLowStockAlerts();
  const { data: expiryResponse } = useExpiryAlerts();

  const stats = statsResponse?.data;
  const lowStockAlerts = lowStockResponse?.data;
  const expiryAlerts = expiryResponse?.data;

  const statCards = [
    {
      title: 'Total Items',
      value: stats?.totalItems || 0,
      icon: <InventoryIcon />,
      color: 'primary',
      link: '/inventory/items',
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems || 0,
      icon: <WarningIcon />,
      color: 'error',
      link: '/inventory/items',
    },
    {
      title: 'Expiring Soon',
      value: stats?.expiringItems || 0,
      icon: <OfferIcon />,
      color: 'warning',
      link: '/inventory/items',
    },
    {
      title: 'Suppliers',
      value: stats?.totalSuppliers || 0,
      icon: <BusinessIcon />,
      color: 'info',
      link: '/admin/suppliers',
    },
    {
      title: 'Pending POs',
      value: stats?.pendingPOs || 0,
      icon: <CartIcon />,
      color: 'secondary',
      link: '/documents/purchase-orders',
    },
    {
      title: 'Warehouses',
      value: stats?.totalWarehouses || 0,
      icon: <WarehouseIcon />,
      color: 'success',
      link: '/admin/warehouses',
    },
  ];

  const stockChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Items Received',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
      },
      {
        label: 'Items Issued',
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const categoryChartData = {
    labels: ['Raw Materials', 'Spices', 'Packaging', 'Cleaning', 'Equipment'],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          '#0ea5e9',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening with your inventory.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              component={Link}
              to={card.link}
              sx={{
                height: '100%',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color={`${card.color}.main`}>
                      {statsLoading ? '...' : card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: `${card.color}.main`, opacity: 0.7 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {(lowStockAlerts && lowStockAlerts.length > 0) && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>{lowStockAlerts.length}</strong> items are running low on stock. Immediate action required.
            </Typography>
          </Alert>
        </Box>
      )}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Monthly Inventory Activity
            </Typography>
            <Box sx={{ height: 320 }}>
              <Bar data={stockChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Category Distribution
            </Typography>
            <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={categoryChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Low Stock Alerts
            </Typography>
            {alertsLoading ? (
              <LinearProgress />
            ) : lowStockAlerts && lowStockAlerts.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Current</TableCell>
                      <TableCell>Reorder</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockAlerts.slice(0, 5).map((alert: any) => (
                      <TableRow key={alert._id}>
                        <TableCell>{alert.itemName}</TableCell>
                        <TableCell>
                          <Typography color="error.main" fontWeight={600}>
                            {alert.currentStock}
                          </Typography>
                        </TableCell>
                        <TableCell>{alert.reorderLevel}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${alert.daysUntilStockout} days`}
                            size="small"
                            color={alert.daysUntilStockout < 7 ? 'error' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No low stock alerts
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Expiry Alerts
            </Typography>
            {expiryAlerts && expiryAlerts.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expiryAlerts.slice(0, 5).map((alert: any) => (
                      <TableRow key={alert._id}>
                        <TableCell>{alert.itemName}</TableCell>
                        <TableCell>{alert.batchNumber || '-'}</TableCell>
                        <TableCell>
                          {format(new Date(alert.expiryDate), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${alert.daysUntilExpiry} days`}
                            size="small"
                            color={alert.daysUntilExpiry < 30 ? 'error' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No expiry alerts
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
