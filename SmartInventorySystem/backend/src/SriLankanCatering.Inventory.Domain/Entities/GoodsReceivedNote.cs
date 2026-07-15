using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class GoodsReceivedNote : BaseEntity
{
    public required string GrnNumber { get; set; }
    public required Guid PurchaseOrderId { get; set; }
    public PurchaseOrder PurchaseOrder { get; set; } = null!;
    public required Guid SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public required Guid ReceivedBy { get; set; }
    public Guid? VerifiedBy { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public required Guid StorageLocationId { get; set; }
    public StorageLocation StorageLocation { get; set; } = null!;
    public DateTime DeliveryDate { get; set; }
    public string? DeliveryNoteNumber { get; set; }
    public string? VehicleNumber { get; set; }
    public string? DriverName { get; set; }
    public string? DriverContact { get; set; }
    public DateTime ReceivedDate { get; set; }
    public GoodsReceivedNoteStatus Status { get; set; } = GoodsReceivedNoteStatus.Draft;
    public Money TotalValue { get; set; } = new(0, "LKR");
    public string? InspectionNotes { get; set; }
    public string? QualityRemarks { get; set; }
    public bool IsQualityPassed { get; set; } = false;
    public decimal TotalQuantityAccepted { get; set; } = 0;
    public decimal TotalQuantityRejected { get; set; } = 0;
    public string? RejectionReason { get; set; }
    public bool IsAiVerified { get; set; }
    public string? AiVerificationResult { get; set; }
    public string? InvoiceNumber { get; set; }
    public DateTime? InvoiceDate { get; set; }
    public bool IsPostedToInventory { get; set; } = false;
    public DateTime? PostedAt { get; set; }
    public Guid? PostedBy { get; set; }
    public ICollection<GoodsReceivedNoteLine> Lines { get; set; } = new List<GoodsReceivedNoteLine>();
}
