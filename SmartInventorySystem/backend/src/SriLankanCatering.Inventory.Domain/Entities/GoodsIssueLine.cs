namespace SriLankanCatering.Inventory.Domain.Entities;

public class GoodsIssueLine : BaseEntity
{
    public required Guid GoodsIssueId { get; set; }
    public GoodsIssue GoodsIssue { get; set; } = null!;
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required Guid BatchId { get; set; }
    public StockBatch Batch { get; set; } = null!;
    public int LineNumber { get; set; }
    public required string ItemCode { get; set; }
    public string? ItemName { get; set; }
    public required string BatchNumber { get; set; }
    public required decimal QuantityIssued { get; set; }
    public required string UnitOfMeasure { get; set; }
    public Money UnitCost { get; set; } = new(0, "LKR");
    public Money LineAmount { get; set; } = new(0, "LKR");
    public string? Notes { get; set; }
    public string? AllocatedTo { get; set; }
    public Guid? IssuedBy { get; set; }
    public DateTime? IssuedAt { get; set; }
}
