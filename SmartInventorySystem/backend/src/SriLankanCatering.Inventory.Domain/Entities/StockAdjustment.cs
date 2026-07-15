namespace SriLankanCatering.Inventory.Domain.Entities;

public class StockAdjustment : BaseEntity
{
    public required string AdjustmentNumber { get; set; }
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public required Guid StorageLocationId { get; set; }
    public StorageLocation StorageLocation { get; set; } = null!;
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public required Guid PerformedBy { get; set; }
    public DateTime AdjustedDate { get; set; }
    public string? Reason { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public bool IsAiSuggested { get; set; }
    public ICollection<StockAdjustmentLine> Lines { get; set; } = new List<StockAdjustmentLine>();
}
