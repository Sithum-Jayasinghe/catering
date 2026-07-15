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
  Rating,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useSuppliers } from '@/hooks/useApi';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function Suppliers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  const { data, isLoading, refetch } = useSuppliers({ page: page + 1, limit: rowsPerPage, search });
  const items = data?.data || [];
  const total = data?.pagination?.total || 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Sri Lanka',
    },
  });

  const openCreateDialog = () => {
    setEditingSupplier(null);
    reset({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Sri Lanka',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (supplier: any) => {
    setEditingSupplier(supplier);
    reset({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: SupplierFormData) => {
    console.log(editingSupplier ? 'Update supplier:' : 'Create supplier:', data);
    setDialogOpen(false);
    refetch();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Suppliers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage supplier relationships and information
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Add Supplier
        </Button>
      </Box>

      <Paper>
        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search suppliers..."
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
                    <TableCell>Supplier</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((supplier: any) => (
                    <TableRow key={supplier._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                            {supplier.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {supplier.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {supplier.contactPerson}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{supplier.email}</Typography>
                        <Typography variant="caption" color="text.secondary">{supplier.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        {supplier.city}, {supplier.country}
                      </TableCell>
                      <TableCell>
                        <Rating value={supplier.rating || 0} readOnly size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={supplier.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><ViewIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => openEditDialog(supplier)}>
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
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">No suppliers found</Typography>
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
          <Typography variant="h6">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField {...register('name')} label="Supplier Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('contactPerson')} label="Contact Person" fullWidth error={!!errors.contactPerson} helperText={errors.contactPerson?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('email')} label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('phone')} label="Phone" fullWidth error={!!errors.phone} helperText={errors.phone?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField {...register('country')} label="Country" fullWidth error={!!errors.country} helperText={errors.country?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('address')} label="Address" fullWidth multiline rows={2} error={!!errors.address} helperText={errors.address?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('city')} label="City" fullWidth error={!!errors.city} helperText={errors.city?.message} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editingSupplier ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
