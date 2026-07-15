namespace SriLankanCatering.Inventory.Domain.Entities;

public class StockTransferLine : BaseEntity
{
    public required Guid StockTransferId { get; set; }
    public StockTransfer StockTransfer { get; set; } = null!;
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required Guid BatchId { get; set; }
    public StockBatch Batch { get; set; } = null!;
    public int LineNumber { get; set; }
    public required string ItemCode { get; set; }
    public string? ItemName { get; set; }
    public required string BatchNumber { get; set; }
    public required decimal Quantity { get; set; }
    public string? UnitOfMeasure { get; set; }
    public required Guid FromStorageLocationId { get; set; }
    public StorageLocation FromStorageLocation { get; set; } = null!;
    public required Guid ToStorageLocationId { get; set; }
    public StorageLocation ToStorageLocation { get; set; } = null!;
    public decimal QuantityShipped { get; set; } = 0;
    public decimal QuantityReceived { get; set; } = 0;
    public string? Notes { get; set; }
}
