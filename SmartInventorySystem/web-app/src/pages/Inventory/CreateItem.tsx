import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Switch,
  FormControlLabel,
  LinearProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateItem, useSuppliers, useWarehouses } from '@/hooks/useApi';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  reorderLevel: z.coerce.number().min(0),
  reorderQuantity: z.coerce.number().min(0),
  currentStock: z.coerce.number().min(0),
  unitCost: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().optional(),
  supplierId: z.string().optional(),
  warehouseId: z.string().optional(),
  location: z.string().optional(),
  expiryDate: z.string().optional(),
  batchNumber: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

const categories = ['Raw Materials', 'Spices', 'Packaging', 'Cleaning Supplies', 'Equipment', 'Beverages', 'Dairy', 'Grains', 'Vegetables', 'Fruits'];

export default function CreateItem() {
  const navigate = useNavigate();
  const { data: suppliersData } = useSuppliers();
  const { data: warehousesData } = useWarehouses();
  const createMutation = useCreateItem();

  const suppliers = suppliersData?.data || [];
  const warehouses = warehousesData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      category: '',
      unitOfMeasure: 'pcs',
      reorderLevel: 10,
      reorderQuantity: 50,
      currentStock: 0,
      unitCost: 0,
      sellingPrice: 0,
      supplierId: '',
      warehouseId: '',
      location: '',
      expiryDate: '',
      batchNumber: '',
      tags: [],
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    try {
      await createMutation.mutateAsync(data);
      navigate('/inventory/items');
    } catch {
      // Error handled
    }
  };

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
        <Typography variant="h4" fontWeight={700}>
          Create New Item
        </Typography>
      </Box>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create item
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('name')}
                    label="Item Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('sku')}
                    label="SKU"
                    fullWidth
                    error={!!errors.sku}
                    helperText={errors.sku?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register('description')}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      {...register('category')}
                      label="Category"
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('unitOfMeasure')}
                    label="Unit of Measure"
                    fullWidth
                    select
                  >
                    <MenuItem value="pcs">Pieces</MenuItem>
                    <MenuItem value="kg">Kilograms</MenuItem>
                    <MenuItem value="liters">Liters</MenuItem>
                    <MenuItem value="boxes">Boxes</MenuItem>
                    <MenuItem value="packs">Packs</MenuItem>
                    <MenuItem value="units">Units</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={field.value || []}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Tags" placeholder="Add tags" />
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Stock Information
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    {...register('currentStock')}
                    label="Current Stock"
                    type="number"
                    fullWidth
                    error={!!errors.currentStock}
                    helperText={errors.currentStock?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    {...register('reorderLevel')}
                    label="Reorder Level"
                    type="number"
                    fullWidth
                    error={!!errors.reorderLevel}
                    helperText={errors.reorderLevel?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    {...register('reorderQuantity')}
                    label="Reorder Quantity"
                    type="number"
                    fullWidth
                    error={!!errors.reorderQuantity}
                    helperText={errors.reorderQuantity?.message}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Pricing & Supplier
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('unitCost')}
                    label="Unit Cost (LKR)"
                    type="number"
                    fullWidth
                    error={!!errors.unitCost}
                    helperText={errors.unitCost?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('sellingPrice')}
                    label="Selling Price (LKR)"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Supplier</InputLabel>
                    <Select
                      {...register('supplierId')}
                      label="Supplier"
                    >
                      <MenuItem value="">None</MenuItem>
                      {suppliers.map((supplier: any) => (
                        <MenuItem key={supplier._id} value={supplier._id}>{supplier.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Warehouse</InputLabel>
                    <Select
                      {...register('warehouseId')}
                      label="Warehouse"
                    >
                      <MenuItem value="">None</MenuItem>
                      {warehouses.map((warehouse: any) => (
                        <MenuItem key={warehouse._id} value={warehouse._id}>{warehouse.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Additional Information
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('location')}
                    label="Storage Location"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('batchNumber')}
                    label="Batch Number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register('expiryDate')}
                    label="Expiry Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Active"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Unit Cost</Typography>
                  <Typography variant="body2" fontWeight={600}>LKR 0.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Selling Price</Typography>
                  <Typography variant="body2" fontWeight={600}>LKR 0.00</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Value</Typography>
                  <Typography variant="body2" fontWeight={600}>LKR 0.00</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" component={Link} to="/inventory/items">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Item'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {createMutation.isPending && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
}
