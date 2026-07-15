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
  Grid,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Warehouse as WarehouseIcon,
} from '@mui/icons-material';
import { useWarehouses } from '@/hooks/useApi';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const warehouseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  capacity: z.coerce.number().min(1, 'Capacity is required'),
  managerName: z.string().min(1, 'Manager name is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

export default function Warehouses() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);

  const { data, isLoading, refetch } = useWarehouses({ page: page + 1, limit: rowsPerPage, search });
  const items = data?.data || [];
  const total = data?.pagination?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: '',
      code: '',
      location: '',
      address: '',
      city: '',
      capacity: 1000,
      managerName: '',
      contactPhone: '',
    },
  });

  const openCreateDialog = () => {
    setEditingWarehouse(null);
    reset({
      name: '',
      code: '',
      location: '',
      address: '',
      city: '',
      capacity: 1000,
      managerName: '',
      contactPhone: '',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (warehouse: any) => {
    setEditingWarehouse(warehouse);
    reset({
      name: warehouse.name,
      code: warehouse.code,
      location: warehouse.location,
      address: warehouse.address,
      city: warehouse.city,
      capacity: warehouse.capacity,
      managerName: warehouse.managerName,
      contactPhone: warehouse.contactPhone,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: WarehouseFormData) => {
    console.log(editingWarehouse ? 'Update warehouse:' : 'Create warehouse:', data);
    setDialogOpen(false);
    refetch();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Warehouses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage warehouse locations and capacity
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Add Warehouse
        </Button>
      </Box>

      <Paper>
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search warehouses..."
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
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((warehouse: any) => (
                    <TableRow key={warehouse._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main' }}>
                            <WarehouseIcon sx={{ fontSize: 20 }} />
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {warehouse.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={warehouse.code} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {warehouse.city}, {warehouse.location}
                      </TableCell>
                      <TableCell>{warehouse.capacity?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{warehouse.managerName}</Typography>
                        <Typography variant="caption" color="text.secondary">{warehouse.contactPhone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={warehouse.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={warehouse.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><ViewIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => openEditDialog(warehouse)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">No warehouses found</Typography>
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
          <Typography variant="h6">{editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField {...register('name')} label="Warehouse Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('code')} label="Code" fullWidth error={!!errors.code} helperText={errors.code?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('address')} label="Address" fullWidth multiline rows={2} error={!!errors.address} helperText={errors.address?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('city')} label="City" fullWidth error={!!errors.city} helperText={errors.city?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('location')} label="Location" fullWidth error={!!errors.location} helperText={errors.location?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('capacity')} label="Capacity" type="number" fullWidth error={!!errors.capacity} helperText={errors.capacity?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('managerName')} label="Manager Name" fullWidth error={!!errors.managerName} helperText={errors.managerName?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('contactPhone')} label="Contact Phone" fullWidth error={!!errors.contactPhone} helperText={errors.contactPhone?.message} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editingWarehouse ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
