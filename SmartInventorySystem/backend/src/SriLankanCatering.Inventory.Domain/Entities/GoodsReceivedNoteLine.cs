using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class GoodsReceivedNoteLine : BaseEntity
{
    public required Guid GoodsReceivedNoteId { get; set; }
    public GoodsReceivedNote GoodsReceivedNote { get; set; } = null!;
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public int LineNumber { get; set; }
    public required string ItemCode { get; set; }
    public string? ItemName { get; set; }
    public required string BatchNumber { get; set; }
    public string? SerialNumber { get; set; }
    public DateTime? ManufacturedDate { get; set; }
    public required DateTime ExpiryDate { get; set; }
    public DateTime? BestBeforeDate { get; set; }
    public required decimal QuantityOrdered { get; set; }
    public required decimal QuantityReceived { get; set; }
    public decimal QuantityAccepted { get; set; }
    public decimal QuantityRejected { get; set; }
    public required string UnitOfMeasure { get; set; }
    public Money UnitPrice { get; set; } = new(0, "LKR");
    public Money LineAmount { get; set; } = new(0, "LKR");
    public string? RejectionReason { get; set; }
    public string? InspectionNotes { get; set; }
    public ItemCondition Condition { get; set; } = ItemCondition.New;
    public QualityGrade QualityGrade { get; set; } = QualityGrade.A;
    public bool IsBatchCreated { get; set; } = false;
    public Guid? BatchId { get; set; }
    public StockBatch? Batch { get; set; }
    public required Guid StorageLocationId { get; set; }
    public StorageLocation StorageLocation { get; set; } = null!;
}
