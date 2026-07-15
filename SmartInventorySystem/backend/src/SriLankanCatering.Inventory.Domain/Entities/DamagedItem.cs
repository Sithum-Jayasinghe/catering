using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class DamagedItem : BaseEntity
{
    public required string DamageReportNumber { get; set; }
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public required Guid StorageLocationId { get; set; }
    public StorageLocation StorageLocation { get; set; } = null!;
    public required Guid BatchId { get; set; }
    public StockBatch Batch { get; set; } = null!;
    public decimal Quantity { get; set; }
    public required string UnitOfMeasure { get; set; }
    public Money UnitCost { get; set; } = new(0, "LKR");
    public Money TotalValue { get; set; } = new(0, "LKR");
    public required string DamageType { get; set; }
    public required string Reason { get; set; }
    public ItemCondition Condition { get; set; } = ItemCondition.Damaged;
    public bool IsUsable { get; set; }
    public string? ActionTaken { get; set; }
    public Guid ReportedBy { get; set; }
    public DateTime ReportedDate { get; set; }
    public Guid? ProcessedBy { get; set; }
    public DateTime? ProcessedDate { get; set; }
    public string? Notes { get; set; }
    public string? ImageUrl { get; set; }
}
