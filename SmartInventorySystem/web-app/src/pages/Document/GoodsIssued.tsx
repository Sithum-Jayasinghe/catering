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
  Close as CloseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useGoodsIssued, useItems } from '@/hooks/useApi';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createSchema = z.object({
  itemId: z.string().min(1, 'Item is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  purpose: z.string().min(1, 'Purpose is required'),
  issuedTo: z.string().min(1, 'Issued to is required'),
  issuedDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof createSchema>;

export default function GoodsIssued() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useGoodsIssued({ page: page + 1, limit: rowsPerPage, search });
  const { data: itemsData } = useItems();

  const items = data?.data || [];
  const inventoryItems = itemsData?.data || [];
  const total = data?.pagination?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      itemId: '',
      quantity: 0,
      purpose: '',
      issuedTo: '',
      issuedDate: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Create GI:', data);
    reset();
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Goods Issued
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track items issued from inventory to departments
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Issue Goods
        </Button>
      </Box>

      <Paper>
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search goods issued..."
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
                    <TableCell>GI Number</TableCell>
                    <TableCell>Issued To</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Issued Date</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((gi: any) => (
                    <TableRow key={gi._id} hover>
                      <TableCell>{gi.giNumber}</TableCell>
                      <TableCell>{gi.issuedTo}</TableCell>
                      <TableCell>{gi.purpose}</TableCell>
                      <TableCell>{format(new Date(gi.issuedDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>LKR {gi.totalValue?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={gi.status}
                          size="small"
                          color={gi.status === 'Completed' ? 'success' : gi.status === 'Pending' ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><ViewIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">No goods issued records found</Typography>
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
          <Typography variant="h6">Issue Goods</Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.itemId}>
                  <InputLabel>Item</InputLabel>
                  <Select {...register('itemId')} label="Item">
                    {inventoryItems.map((item: any) => (
                      <MenuItem key={item._id} value={item._id}>{item.name} (Stock: {item.currentStock})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('quantity')} label="Quantity" type="number" fullWidth error={!!errors.quantity} helperText={errors.quantity?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('issuedTo')} label="Issued To" fullWidth error={!!errors.issuedTo} helperText={errors.issuedTo?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('purpose')} label="Purpose" fullWidth error={!!errors.purpose} helperText={errors.purpose?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('notes')} label="Notes" fullWidth multiline rows={3} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Issue Goods</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
