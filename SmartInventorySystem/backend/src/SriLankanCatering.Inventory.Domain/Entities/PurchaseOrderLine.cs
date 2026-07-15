using SriLankanCatering.Inventory.Domain.Enums;
using SriLankanCatering.Inventory.Domain.Common;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class PurchaseOrderLine : BaseEntity
{
    public required Guid PurchaseOrderId { get; set; }
    public PurchaseOrder PurchaseOrder { get; set; } = null!;
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public int LineNumber { get; set; }
    public required string ItemCode { get; set; }
    public string? ItemName { get; set; }
    public required string UnitOfMeasure { get; set; }
    public required decimal QuantityOrdered { get; set; }
    public decimal QuantityReceived { get; set; } = 0;
    public decimal QuantityReturned { get; set; } = 0;
    public Money UnitPrice { get; set; } = new(0, "LKR");
    public Money LineAmount { get; set; } = new(0, "LKR");
    public Money TaxAmount { get; set; } = new(0, "LKR");
    public Money DiscountAmount { get; set; } = new(0, "LKR");
    public Money TotalAmount { get; set; } = new(0, "LKR");
    public DateTime? RequiredDeliveryDate { get; set; }
    public string? Notes { get; set; }
    public string? AccountCode { get; set; }
    public string? Department { get; set; }
}
