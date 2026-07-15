import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  QrCode as QrIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useItem } from '@/hooks/useApi';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useItem(id || '');

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!data?.data) {
    return (
      <Box>
        <Alert severity="error">Item not found</Alert>
      </Box>
    );
  }

  const item = data.data;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          component={Link}
          to="/inventory/items"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            SKU: {item.sku} | {item.category}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<EditIcon />} component={Link} to={`/inventory/items/${id}/edit`}>
          Edit
        </Button>
      </Box>

      <Tabs value={0} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Details" />
        <Tab label="Stock History" />
        <Tab label="Documents" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">SKU</Typography>
                <Typography variant="body2" fontWeight={500}>{item.sku}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography variant="body2" fontWeight={500}>{item.category}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Unit of Measure</Typography>
                <Typography variant="body2" fontWeight={500}>{item.unitOfMeasure}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Location</Typography>
                <Typography variant="body2" fontWeight={500}>{item.location || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Description</Typography>
                <Typography variant="body2">{item.description || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Tags</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  {item.tags.map((tag: string) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Financial Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Unit Cost</Typography>
                <Typography variant="body2" fontWeight={600}>LKR {item.unitCost.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Selling Price</Typography>
                <Typography variant="body2" fontWeight={600}>{item.sellingPrice ? `LKR ${item.sellingPrice.toFixed(2)}` : '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Current Stock</Typography>
                <Typography variant="body2" fontWeight={600} color={item.currentStock <= item.reorderLevel ? 'error.main' : 'text.primary'}>
                  {item.currentStock} {item.unitOfMeasure}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Total Value</Typography>
                <Typography variant="body2" fontWeight={600}>
                  LKR {(item.currentStock * item.unitCost).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Stock Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Stock Level</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {item.currentStock} / {item.reorderLevel * 2}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((item.currentStock / (item.reorderLevel * 2)) * 100, 100)}
                color={item.currentStock <= item.reorderLevel ? 'error' : 'success'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Chip
              label={item.currentStock <= item.reorderLevel ? 'Low Stock' : 'In Stock'}
              color={item.currentStock <= item.reorderLevel ? 'error' : 'success'}
              sx={{ width: '100%' }}
            />
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Reorder Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Reorder Level</Typography>
              <Typography variant="body2" fontWeight={600}>{item.reorderLevel}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Reorder Qty</Typography>
              <Typography variant="body2" fontWeight={600}>{item.reorderQuantity}</Typography>
            </Box>
          </Paper>

          {item.expiryDate && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Expiry Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Expiry Date</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                </Typography>
              </Box>
              {item.batchNumber && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Batch Number</Typography>
                  <Typography variant="body2" fontWeight={600}>{item.batchNumber}</Typography>
                </Box>
              )}
            </Paper>
          )}

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Metadata
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Created</Typography>
              <Typography variant="caption">{format(new Date(item.createdAt), 'MMM dd, yyyy')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Updated</Typography>
              <Typography variant="caption">{format(new Date(item.updatedAt), 'MMM dd, yyyy')}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
