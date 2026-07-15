namespace SriLankanCatering.Inventory.Domain.Entities;

public class InventoryItemSupplier : BaseEntity
{
    public required Guid InventoryItemId { get; set; }
    public InventoryItem InventoryItem { get; set; } = null!;
    public required Guid SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public bool IsPrimary { get; set; }
    public string? SupplierItemCode { get; set; }
    public string? SupplierItemName { get; set; }
    public required decimal UnitPrice { get; set; }
    public int LeadTimeDays { get; set; }
    public int MinimumOrderQuantity { get; set; }
    public decimal OrderIntervalDays { get; set; }
    public decimal DiscountPercentage { get; set; } = 0;
    public Guid? NegotiatedById { get; set; }
    public DateTime? NegotiatedDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastOrderDate { get; set; }
    public DateTime? LastDeliveryDate { get; set; }
    public string? Notes { get; set; }
}
