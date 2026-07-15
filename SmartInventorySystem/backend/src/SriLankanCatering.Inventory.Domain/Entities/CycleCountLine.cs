namespace SriLankanCatering.Inventory.Domain.Entities;

public class CycleCountLine : BaseEntity
{
    public required Guid CycleCountId { get; set; }
    public CycleCount CycleCount { get; set; } = null!;
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required Guid BatchId { get; set; }
    public StockBatch Batch { get; set; } = null!;
    public int LineNumber { get; set; }
    public string? ItemCode { get; set; }
    public string? ItemName { get; set; }
    public required string BatchNumber { get; set; }
    public required decimal SystemQuantity { get; set; }
    public required decimal CountedQuantity { get; set; }
    public required decimal Variance { get; set; }
    public string? UnitOfMeasure { get; set; }
    public Money UnitCost { get; set; } = new(0, "LKR");
    public Money VarianceValue { get; set; } = new(0, "LKR");
    public string? VarianceReason { get; set; }
    public string? Notes { get; set; }
    public bool IsRecounted { get; set; }
    public decimal RecountedQuantity { get; set; } = 0;
}
