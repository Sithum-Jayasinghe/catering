import { Box, Paper, Typography, Chip, LinearProgress, Alert, Grid } from '@mui/material';
import { Lightbulb as LightIcon, TrendingUp as TrendingIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useRecommendations } from '@/hooks/useApi';

export default function Recommendations() {
  const { data, isLoading } = useRecommendations();
  const recommendations = data?.data || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'Reorder': return <TrendingIcon />;
      case 'StockReduction': return <WarningIcon />;
      case 'SupplierChange': return <LightIcon />;
      default: return <LightIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          AI Recommendations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-powered insights and suggestions for inventory optimization
        </Typography>
      </Box>

      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {recommendations.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>{recommendations.length}</strong> recommendations generated based on your inventory data analysis.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {recommendations.map((rec: any) => (
          <Grid item xs={12} md={6} key={rec._id}>
            <Paper sx={{ p: 3, height: '100%', border: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {getIcon(rec.type)}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {rec.title}
                  </Typography>
                </Box>
                <Chip
                  label={rec.priority}
                  size="small"
                  color={getPriorityColor(rec.priority) as any}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {rec.description}
              </Typography>
              <Box sx={{ bgcolor: 'primary.light', color: 'primary.dark', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="caption" fontWeight={600}>
                  Suggested Action:
                </Typography>
                <Typography variant="body2">
                  {rec.suggestedAction}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {rec.itemName && `Item: ${rec.itemName}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Est. Impact: {rec.estimatedImpact}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
        {recommendations.length === 0 && !isLoading && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <LightIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                No recommendations available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check back later for AI-generated insights
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
