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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Check as ApproveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useStockTransfers, useWarehouses, useItems } from '@/hooks/useApi';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createSchema = z.object({
  fromWarehouseId: z.string().min(1, 'From warehouse is required'),
  toWarehouseId: z.string().min(1, 'To warehouse is required'),
  transferDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof createSchema>;

export default function StockTransfer() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useStockTransfers({ page: page + 1, limit: rowsPerPage, search });
  const { data: warehousesData } = useWarehouses();

  const warehouses = warehousesData?.data || [];
  const items = data?.data || [];
  const total = data?.pagination?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      fromWarehouseId: '',
      toWarehouseId: '',
      transferDate: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Create ST:', data);
    reset();
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Stock Transfers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage stock movements between warehouses
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New Transfer
        </Button>
      </Box>

      <Paper>
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search stock transfers..."
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
                    <TableCell>ST Number</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Transfer Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((st: any) => (
                    <TableRow key={st._id} hover>
                      <TableCell>{st.stNumber}</TableCell>
                      <TableCell>{st.fromWarehouseName}</TableCell>
                      <TableCell>{st.toWarehouseName}</TableCell>
                      <TableCell>{format(new Date(st.transferDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Chip
                          label={st.status}
                          size="small"
                          color={
                            st.status === 'Completed' ? 'success' :
                            st.status === 'Approved' ? 'info' :
                            st.status === 'In Transit' ? 'warning' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><ViewIcon fontSize="small" /></IconButton>
                        {st.status === 'Pending' && (
                          <IconButton size="small" color="success"><ApproveIcon fontSize="small" /></IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">No stock transfers found</Typography>
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
          <Typography variant="h6">Create Stock Transfer</Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.fromWarehouseId}>
                  <InputLabel>From Warehouse</InputLabel>
                  <Select {...register('fromWarehouseId')} label="From Warehouse">
                    {warehouses.map((wh: any) => (
                      <MenuItem key={wh._id} value={wh._id}>{wh.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.toWarehouseId}>
                  <InputLabel>To Warehouse</InputLabel>
                  <Select {...register('toWarehouseId')} label="To Warehouse">
                    {warehouses.map((wh: any) => (
                      <MenuItem key={wh._id} value={wh._id}>{wh.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('transferDate')} label="Transfer Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.transferDate} helperText={errors.transferDate?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('notes')} label="Notes" fullWidth multiline rows={3} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create Transfer</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
