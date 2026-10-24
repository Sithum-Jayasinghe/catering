import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Title, Paragraph, Button, Surface, IconButton, Divider, SegmentedButtons } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { APP_CONSTANTS } from '../utils/constants';

type ReportType = 'summary' | 'movement' | 'valuation' | 'aging';

export default function ReportsScreen() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('summary');
  const [loading, setLoading] = useState(false);

  const reports: { id: ReportType; title: string; description: string; icon: string }[] = [
    {
      id: 'summary',
      title: 'Summary Report',
      description: 'Overview of inventory metrics, stock levels, and KPIs',
      icon: 'dashboard',
    },
    {
      id: 'movement',
      title: 'Movement Report',
      description: 'Track stock in/out movements, trends, and patterns',
      icon: 'swap-horiz',
    },
    {
      id: 'valuation',
      title: 'Valuation Report',
      description: 'Inventory valuation, cost analysis, and financial impact',
      icon: 'attach-money',
    },
    {
      id: 'aging',
      title: 'Aging Report',
      description: 'Inventory aging analysis, slow movers, and obsolescence',
      icon: 'schedule',
    },
  ];

  const selectedReportData = reports.find((r) => r.id === selectedReport)!;

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Report Ready', `${selectedReportData.title} has been generated successfully. In the full implementation, this would download a PDF or Excel file.`, [
        { text: 'OK' },
        { text: 'Share', onPress: () => Alert.alert('Share', 'Share functionality would open native share sheet') },
      ]);
    }, 2000);
  };

  const summaryMetrics = [
    { label: 'Total Items', value: '2,486', change: '+5.2%', positive: true },
    { label: 'Total Value', value: '$145,280', change: '+3.1%', positive: true },
    { label: 'Low Stock Items', value: '34', change: '-12%', positive: true },
    { label: 'Out of Stock', value: '12', change: '+2', positive: false },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Reports</Title>
        <Paragraph style={styles.headerSubtitle}>
          Generate and manage inventory reports
        </Paragraph>
      </View>

      <View style={styles.reportTypesContainer}>
        <Text style={styles.sectionTitle}>Report Types</Text>
        <View style={styles.reportTypesGrid}>
          {reports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={[
                styles.reportTypeCard,
                selectedReport === report.id && styles.reportTypeCardActive,
              ]}
              onPress={() => setSelectedReport(report.id)}
            >
              <Surface style={[
                styles.reportTypeIcon,
                selectedReport === report.id && { backgroundColor: APP_CONSTANTS.THEME.PRIMARY + '20' }
              ]} elevation={selectedReport === report.id ? 0 : 1}>
                <MaterialIcons
                  name={report.icon}
                  size={24}
                  color={selectedReport === report.id ? APP_CONSTANTS.THEME.PRIMARY : '#64748b'}
                />
              </Surface>
              <Text style={[
                styles.reportTypeTitle,
                selectedReport === report.id && { color: APP_CONSTANTS.THEME.PRIMARY }
              ]}>
                {report.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Surface style={styles.detailsCard} elevation={2}>
        <View style={styles.detailsHeader}>
          <View>
            <Title style={styles.detailsTitle}>{selectedReportData.title}</Title>
            <Paragraph style={styles.detailsDescription}>
              {selectedReportData.description}
            </Paragraph>
          </View>
        </View>

        <Divider style={styles.divider} />

        {selectedReport === 'summary' && (
          <View style={styles.metricsContainer}>
            {summaryMetrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <View style={styles.metricChange}>
                  <MaterialIcons
                    name={metric.positive ? 'arrow-upward' : 'arrow-downward'}
                    size={14}
                    color={metric.positive ? APP_CONSTANTS.THEME.SUCCESS : APP_CONSTANTS.THEME.DANGER}
                  />
                  <Text style={[
                    styles.metricChangeText,
                    { color: metric.positive ? APP_CONSTANTS.THEME.SUCCESS : APP_CONSTANTS.THEME.DANGER }
                  ]}>
                    {metric.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedReport === 'movement' && (
          <View style={styles.movementData}>
            <View style={styles.movementRow}>
              <View style={styles.movementCard}>
                <MaterialIcons name="arrow-upward" size={20} color={APP_CONSTANTS.THEME.DANGER} />
                <Text style={styles.movementValue}>1,248</Text>
                <Text style={styles.movementLabel}>Total Issues</Text>
              </View>
              <View style={styles.movementCard}>
                <MaterialIcons name="arrow-downward" size={20} color={APP_CONSTANTS.THEME.SUCCESS} />
                <Text style={styles.movementValue}>892</Text>
                <Text style={styles.movementLabel}>Total Receives</Text>
              </View>
            </View>
            <Text style={styles.dataNote}>Top Movement Items: Electronics (38%), Raw Materials (27%), Packaging (18%)</Text>
          </View>
        )}

        {selectedReport === 'valuation' && (
          <View style={styles.valuationData}>
            <View style={styles.valuationCard}>
              <Text style={styles.valuationLabel}>Total Inventory Value</Text>
              <Text style={styles.valuationValue}>$145,280.00</Text>
            </View>
            <View style={styles.valuationCard}>
              <Text style={styles.valuationLabel}>Average Unit Value</Text>
              <Text style={styles.valuationValue}>$58.42</Text>
            </View>
            <Text style={styles.dataNote}>Breakdown by category available on export</Text>
          </View>
        )}

        {selectedReport === 'aging' && (
          <View style={styles.agingData}>
            <View style={styles.ageRow}>
              <View style={[styles.ageIndicator, { backgroundColor: APP_CONSTANTS.THEME.SUCCESS }]} />
              <Text style={styles.ageLabel}>0-30 days: 1,890 items</Text>
            </View>
            <View style={styles.ageRow}>
              <View style={[styles.ageIndicator, { backgroundColor: APP_CONSTANTS.THEME.WARNING }]} />
              <Text style={styles.ageLabel}>31-90 days: 420 items</Text>
            </View>
            <View style={styles.ageRow}>
              <View style={[styles.ageIndicator, { backgroundColor: APP_CONSTANTS.THEME.DANGER }]} />
              <Text style={styles.ageLabel}>90+ days: 176 items</Text>
            </View>
            <Text style={styles.dataNote}>Consider reviewing items aged 90+ days for potential clearance</Text>
          </View>
        )}

        <Divider style={styles.divider} />

        <View style={styles.actionsRow}>
          <Button
            mode="outlined"
            icon="file-pdf-box"
            onPress={handleGenerateReport}
            style={styles.actionButton}
          >
            PDF
          </Button>
          <Button
            mode="outlined"
            icon="file-excel-box"
            onPress={handleGenerateReport}
            style={styles.actionButton}
          >
            Excel
          </Button>
          <Button
            mode="contained"
            icon="content-save"
            onPress={handleGenerateReport}
            loading={loading}
            disabled={loading}
            style={styles.actionButton}
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </View>
      </Surface>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  reportTypesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  reportTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reportTypeCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reportTypeCardActive: {
    borderColor: APP_CONSTANTS.THEME.PRIMARY,
    backgroundColor: '#ffffff',
  },
  reportTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  detailsCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  detailsDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  metricChangeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  movementData: {
    gap: 12,
  },
  movementRow: {
    flexDirection: 'row',
    gap: 12,
  },
  movementCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  movementValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
  movementLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  valuationData: {
    gap: 12,
  },
  valuationCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  valuationLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  valuationValue: {
    fontSize: 22,
    fontWeight: '700',
    color: APP_CONSTANTS.THEME.PRIMARY,
  },
  agingData: {
    gap: 12,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  ageIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  ageLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  dataNote: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  spacer: {
    height: 24,
  },
});
