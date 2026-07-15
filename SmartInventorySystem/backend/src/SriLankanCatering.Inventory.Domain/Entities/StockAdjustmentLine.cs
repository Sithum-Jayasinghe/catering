namespace SriLankanCatering.Inventory.Domain.Entities;

public class StockAdjustmentLine : BaseEntity
{
    public required Guid StockAdjustmentId { get; set; }
    public StockAdjustment StockAdjustment { get; set; } = null!;
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required Guid BatchId { get; set; }
    public StockBatch Batch { get; set; } = null!;
    public int LineNumber { get; set; }
    public required string ItemCode { get; set; }
    public string? ItemName { get; set; }
    public required string BatchNumber { get; set; }
    public required decimal QuantityBefore { get; set; }
    public required decimal QuantityAfter { get; set; }
    public required decimal AdjustmentQuantity { get; set; }
    public Money UnitCost { get; set; } = new(0, "LKR");
    public Money LineValue { get; set; } = new(0, "LKR");
    public string? Reason { get; set; }
    public string? Notes { get; set; }
}
