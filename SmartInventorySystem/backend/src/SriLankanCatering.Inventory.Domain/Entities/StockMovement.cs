using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class StockMovement : BaseEntity
{
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required Guid BatchId { get; set; }
    public StockBatch Batch { get; set; } = null!;
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public required Guid StorageLocationId { get; set; }
    public StorageLocation StorageLocation { get; set; } = null!;
    public required StockMovementType MovementType { get; set; }
    public required MovementSource Source { get; set; }
    public required Guid? SourceDocumentId { get; set; }
    public required decimal Quantity { get; set; }
    public required string UnitOfMeasure { get; set; }
    public Money? UnitCost { get; set; }
    public Money? TotalCost { get; set; }
    public required decimal QuantityBefore { get; set; }
    public required decimal QuantityAfter { get; set; }
    public string? ReferenceNumber { get; set; }
    public string? Notes { get; set; }
    public Guid? PerformedBy { get; set; }
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? AiGeneratedInsight { get; set; }
    public string? DocumentNumber { get; set; }
    public Guid? TransferBatchId { get; set; }
    public StockBatch? TransferBatch { get; set; }
}
