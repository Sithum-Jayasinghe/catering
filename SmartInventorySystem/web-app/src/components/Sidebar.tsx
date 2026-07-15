import { NavLink, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  LocalShipping as GoodsReceivedIcon,
  Inventory2 as GoodsIssuedIcon,
  SwapHoriz as TransferIcon,
  InsertChart as AnalyticsIcon,
  Assessment as ReportsIcon,
  People as UsersIcon,
  Business as SuppliersIcon,
  Warehouse as WarehousesIcon,
  SmartToy as ChatbotIcon,
  Lightbulb as RecommendationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Toolbar,
  Divider,
  useTheme,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

const drawerWidth = 260;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  {
    path: '/inventory/items',
    label: 'Inventory Items',
    icon: <InventoryIcon />,
    roles: ['Administrator', 'InventoryManager', 'StoreKeeper', 'KitchenManager', 'ProcurementOfficer'],
  },
  {
    path: '/documents/goods-received',
    label: 'Goods Received',
    icon: <GoodsReceivedIcon />,
    roles: ['Administrator', 'StoreKeeper', 'ProcurementOfficer', 'InventoryManager'],
  },
  {
    path: '/documents/goods-issued',
    label: 'Goods Issued',
    icon: <GoodsIssuedIcon />,
    roles: ['Administrator', 'StoreKeeper', 'KitchenManager', 'InventoryManager'],
  },
  {
    path: '/documents/purchase-orders',
    label: 'Purchase Orders',
    icon: <PurchaseIcon />,
    roles: ['Administrator', 'ProcurementOfficer', 'InventoryManager'],
  },
  {
    path: '/documents/stock-transfers',
    label: 'Stock Transfers',
    icon: <TransferIcon />,
    roles: ['Administrator', 'StoreKeeper', 'InventoryManager'],
  },
  {
    path: '/reports/analytics',
    label: 'Analytics',
    icon: <AnalyticsIcon />,
    roles: ['Administrator', 'InventoryManager', 'Auditor', 'FinanceOfficer'],
  },
  {
    path: '/reports/reports',
    label: 'Reports',
    icon: <ReportsIcon />,
    roles: ['Administrator', 'InventoryManager', 'Auditor', 'FinanceOfficer'],
  },
  {
    path: '/admin/users',
    label: 'User Management',
    icon: <UsersIcon />,
    roles: ['Administrator'],
  },
  {
    path: '/admin/suppliers',
    label: 'Suppliers',
    icon: <SuppliersIcon />,
    roles: ['Administrator', 'ProcurementOfficer', 'InventoryManager'],
  },
  {
    path: '/admin/warehouses',
    label: 'Warehouses',
    icon: <WarehousesIcon />,
    roles: ['Administrator', 'InventoryManager', 'StoreKeeper'],
  },
  {
    path: '/ai/chatbot',
    label: 'AI Assistant',
    icon: <ChatbotIcon />,
    roles: ['Administrator', 'InventoryManager', 'StoreKeeper', 'KitchenManager', 'ProcurementOfficer'],
  },
  {
    path: '/ai/recommendations',
    label: 'AI Recommendations',
    icon: <RecommendationsIcon />,
    roles: ['Administrator', 'InventoryManager', 'ProcurementOfficer'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <SettingsIcon />,
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredItems = navigationItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2, py: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Smart Inventory
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SriLankan Catering
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List>
          {filteredItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={onClose}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.active': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.role}
          </Typography>
        </Box>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
