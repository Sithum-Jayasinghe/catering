using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class PurchaseOrder : BaseEntity
{
    public required string PONumber { get; set; }
    public required Guid SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public Guid RequestedBy { get; set; }
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public Guid? IssuedBy { get; set; }
    public DateTime? IssuedAt { get; set; }
    public PurchaseOrderStatus Status { get; set; } = PurchaseOrderStatus.Draft;
    public DateTime RequiredDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public DateTime? ActualDeliveryDate { get; set; }
    public Money TotalAmount { get; set; } = new(0, "LKR");
    public decimal DiscountPercentage { get; set; }
    public Money DiscountAmount { get; set; } = new(0, "LKR");
    public Money TaxAmount { get; set; } = new(0, "LKR");
    public Money FreightCharges { get; set; } = new(0, "LKR");
    public Money GrandTotal { get; set; } = new(0, "LKR");
    public string? PaymentTerms { get; set; }
    public string? ShippingTerms { get; set; }
    public string? Notes { get; set; }
    public string? AiRecommendation { get; set; }
    public DateTime? AiGeneratedDate { get; set; }
    public int TotalLines { get; set; }
    public decimal TotalQuantityOrdered { get; set; } = 0;
    public decimal TotalQuantityReceived { get; set; } = 0;
    public string? ShipToAddress { get; set; }
    public Guid? ShipToWarehouseId { get; set; }
    public Warehouse? ShipToWarehouse { get; set; }
    public ICollection<PurchaseOrderLine> Lines { get; set; } = new List<PurchaseOrderLine>();
    public ICollection<GoodsReceivedNote> GoodsReceivedNotes { get; set; } = new List<GoodsReceivedNote>();
}
