namespace SriLankanCatering.Inventory.Application.DTOs;

public class CreatePurchaseOrderRequest
{
    public required Guid SupplierId { get; set; }
    public required Guid ShipToWarehouseId { get; set; }
    public DateTime RequiredDate { get; set; }
    public string PaymentTerms { get; set; } = string.Empty;
    public List<CreatePurchaseOrderLineRequest> Lines { get; set; } = new();
}

public class CreatePurchaseOrderLineRequest
{
    public Guid InventoryItemId { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
