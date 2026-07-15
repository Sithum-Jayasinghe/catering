using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class ReturnItem : BaseEntity
{
    public required string ReturnNumber { get; set; }
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public required Guid StorageLocationId { get; set; }
    public StorageLocation StorageLocation { get; set; } = null!;
    public required Guid SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public required Guid GoodsReceivedNoteId { get; set; }
    public GoodsReceivedNote GoodsReceivedNote { get; set; } = null!;
    public required Guid BatchId { get; set; }
    public StockBatch Batch { get; set; } = null!;
    public decimal Quantity { get; set; }
    public Money UnitPrice { get; set; } = new(0, "LKR");
    public Money TotalValue { get; set; } = new(0, "LKR");
    public required string Reason { get; set; }
    public string? Notes { get; set; }
    public string? ReceivedFrom { get; set; }
    public ReturnStatus Status { get; set; } = ReturnStatus.Pending;
    public Guid ProcessedBy { get; set; }
    public DateTime? ProcessedDate { get; set; }
    public bool IsCreditNoteCreated { get; set; } = false;
    public string? CreditNoteNumber { get; set; }
}

public enum ReturnStatus
{
    Pending = 1,
    Approved = 2,
    Received = 3,
    Credited = 4,
    Rejected = 5
}
