namespace SriLankanCatering.Inventory.Application.DTOs;

public class DashboardStatsDto
{
    public int TotalInventoryItems { get; set; }
    public int TotalWarehouses { get; set; }
    public int TotalSuppliers { get; set; }
    public int TotalCategories { get; set; }
    public decimal TotalInventoryValue { get; set; }
    public int LowStockItems { get; set; }
    public int OutOfStockItems { get; set; }
    public int ExpiringItemsThisWeek { get; set; }
    public int ExpiredItems { get; set; }
    public int PendingPurchaseOrders { get; set; }
    public int TodayStockMovements { get; set; }
    public int UnreadNotifications { get; set; }
    public int PendingGoodsReceipts { get; set; }
    public int PendingGoodsIssues { get; set; }
    public int ActiveTransferOrders { get; set; }
    public double SupplyChainEfficiencyScore { get; set; }
    public double InventoryAccuracyScore { get; set; }
    public double FoodWastePercentage { get; set; }
    public List<LowStockItemDto> LowStockItemsList { get; set; } = new();
    public List<ExpiringItemDto> ExpiringItemsList { get; set; } = new();
    public List<SupplierPerformanceDto> SupplierPerformanceList { get; set; } = new();
    public List<CategoryValueDto> CategoryValueList { get; set; } = new();
    public List<DailyMovementDto> DailyMovements { get; set; } = new();
    public List<AiInsightDto> AiInsights { get; set; } = new();
}

public class LowStockItemDto
{
    public Guid Id { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public decimal QuantityOnHand { get; set; }
    public decimal ReorderLevel { get; set; }
    public decimal RecommendedReorderQuantity { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}

public class ExpiringItemDto
{
    public Guid Id { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public Guid BatchId { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public decimal RemainingQuantity { get; set; }
    public decimal TotalQuantity { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public int DaysUntilExpiry { get; set; }
    public decimal EstimatedValue { get; set; }
    public string? WarehouseName { get; set; }
}

public class SupplierPerformanceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double OnTimeDeliveryRate { get; set; }
    public double QualityRate { get; set; }
    public double Rating { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalValue { get; set; }
    public double AverageLeadTimeDays { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CategoryValueDto
{
    public Guid Id { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int ItemCount { get; set; }
    public decimal TotalValue { get; set; }
    public double Percentage { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class DailyMovementDto
{
    public DateTime Date { get; set; }
    public int ReceivingCount { get; set; }
    public int IssuingCount { get; set; }
    public int TransferCount { get; set; }
    public int AdjustmentCount { get; set; }
}

public class AiInsightDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Insight { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string ActionUrl { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public string? SourceAgent { get; set; }
    public double ConfidenceScore { get; set; }
    public bool IsActionable { get; set; }
}
