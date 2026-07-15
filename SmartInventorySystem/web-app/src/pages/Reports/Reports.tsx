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
  TextField,
  InputAdornment,
  LinearProgress,
  Alert,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useGoodsReceived, useGoodsIssued, usePurchaseOrders, useStockTransfers } from '@/hooks/useApi';

type ReportType = 'goods-received' | 'goods-issued' | 'purchase-orders' | 'stock-transfers' | 'inventory' | 'all';

export default function Reports() {
  const [reportType, setReportType] = useState<ReportType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: grData } = useGoodsReceived();
  const { data: giData } = useGoodsIssued();
  const { data: poData } = usePurchaseOrders();
  const { data: stData } = useStockTransfers();

  const generateReport = () => {
    console.log('Generate report:', { reportType, startDate, endDate });
    setPreviewOpen(true);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    console.log('Export as:', format);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate and export comprehensive inventory reports
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Report Configuration
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <MenuItem value="all">All Reports</MenuItem>
                <MenuItem value="goods-received">Goods Received</MenuItem>
                <MenuItem value="goods-issued">Goods Issued</MenuItem>
                <MenuItem value="purchase-orders">Purchase Orders</MenuItem>
                <MenuItem value="stock-transfers">Stock Transfers</MenuItem>
                <MenuItem value="inventory">Inventory Summary</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={generateReport}
              sx={{ height: 56 }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Report Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={() => handleExport('csv')}>
              CSV
            </Button>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={() => handleExport('pdf')}>
              PDF
            </Button>
            <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={() => handleExport('excel')}>
              Excel
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            placeholder="Search reports..."
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

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="h5" fontWeight={700}>{grData?.data?.length || 0}</Typography>
              <Typography variant="caption">Goods Received</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
              <Typography variant="h5" fontWeight={700}>{giData?.data?.length || 0}</Typography>
              <Typography variant="caption">Goods Issued</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
              <Typography variant="h5" fontWeight={700}>{poData?.data?.length || 0}</Typography>
              <Typography variant="caption">Purchase Orders</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
              <Typography variant="h5" fontWeight={700}>{stData?.data?.length || 0}</Typography>
              <Typography variant="caption">Stock Transfers</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Report Preview</Typography>
          <IconButton onClick={() => setPreviewOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Report preview will be generated here based on the selected criteria.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<PrintIcon />}>Print</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
