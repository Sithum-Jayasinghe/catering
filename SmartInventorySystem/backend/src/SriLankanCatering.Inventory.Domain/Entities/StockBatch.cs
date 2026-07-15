using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class StockBatch : BaseEntity
{
    public required string BatchNumber { get; set; }
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required Guid StorageLocationId { get; set; }
    public StorageLocation StorageLocation { get; set; } = null!;
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public decimal Quantity { get; set; } = 0;
    public required string UnitOfMeasure { get; set; }
    public DateTime ManufacturedDate { get; set; }
    public required DateTime ExpiryDate { get; set; }
    public DateTime? BestBeforeDate { get; set; }
    public string? LotNumber { get; set; }
    public string? SerialNumber { get; set; }
    public ItemCondition Condition { get; set; } = ItemCondition.New;
    public QualityGrade QualityGrade { get; set; } = QualityGrade.A;
    public string? SupplierBatchNumber { get; set; }
    public Guid? GoodsReceivedNoteId { get; set; }
    public decimal RemainingQuantity { get; set; } = 0;
    public bool IsAllocated { get; set; } = false;
    public DateTime? ExpiryNotificationSent { get; set; }
    public DateTime? NearingExpiryNotificationSent { get; set; }
    public decimal ReturnedQuantity { get; set; } = 0;
    public decimal DamagedQuantity { get; set; } = 0;
    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}
