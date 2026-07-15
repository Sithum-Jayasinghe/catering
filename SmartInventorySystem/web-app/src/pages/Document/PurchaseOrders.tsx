import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextareaAutosize,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Check as ApproveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { usePurchaseOrders, useSuppliers } from '@/hooks/useApi';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const poSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  orderDate: z.string().min(1, 'Date is required'),
  expectedDeliveryDate: z.string().min(1, 'Expected delivery date is required'),
  notes: z.string().optional(),
});

type POFormData = z.infer<typeof poSchema>;

export default function PurchaseOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = usePurchaseOrders({ page: page + 1, limit: rowsPerPage, search });
  const { data: suppliersData } = useSuppliers();

  const suppliers = suppliersData?.data || [];
  const items = data?.data || [];
  const total = data?.pagination?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<POFormData>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      supplierId: '',
      orderDate: format(new Date(), 'yyyy-MM-dd'),
      expectedDeliveryDate: '',
      notes: '',
    },
  });

  const onSubmit = (data: POFormData) => {
    console.log('Create PO:', data);
    reset();
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Purchase Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage purchase orders and supplier procurement
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New PO
        </Button>
      </Box>

      <Paper>
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search purchase orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PO Number</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Expected Delivery</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((po: any) => (
                    <TableRow key={po._id} hover>
                      <TableCell>{po.poNumber}</TableCell>
                      <TableCell>{po.supplierName}</TableCell>
                      <TableCell>{format(new Date(po.orderDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(po.expectedDeliveryDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>LKR {po.totalAmount?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={po.status}
                          size="small"
                          color={
                            po.status === 'Approved' ? 'success' :
                            po.status === 'Ordered' ? 'info' :
                            po.status === 'Partially Received' ? 'warning' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><ViewIcon fontSize="small" /></IconButton>
                        {po.status === 'Submitted' && (
                          <IconButton size="small" color="success"><ApproveIcon fontSize="small" /></IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">No purchase orders found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Create Purchase Order</Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.supplierId}>
                  <InputLabel>Supplier</InputLabel>
                  <Select {...register('supplierId')} label="Supplier">
                    {suppliers.map((s: any) => (
                      <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('orderDate')} label="Order Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.orderDate} helperText={errors.orderDate?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('expectedDeliveryDate')} label="Expected Delivery" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.expectedDeliveryDate} helperText={errors.expectedDeliveryDate?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('notes')} label="Notes" fullWidth multiline rows={3} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create PO</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
