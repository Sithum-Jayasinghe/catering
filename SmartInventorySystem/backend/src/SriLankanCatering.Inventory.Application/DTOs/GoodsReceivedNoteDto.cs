namespace SriLankanCatering.Inventory.Application.DTOs;

public class GoodsReceivedNoteDto
{
    public Guid Id { get; set; }
    public string GrnNumber { get; set; } = string.Empty;
    public Guid PurchaseOrderId { get; set; }
    public string? PONumber { get; set; }
    public Guid SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public Guid ReceivedBy { get; set; }
    public string? ReceivedByName { get; set; }
    public Guid WarehouseId { get; set; }
    public string? WarehouseName { get; set; }
    public Guid StorageLocationId { get; set; }
    public DateTime DeliveryDate { get; set; }
    public DateTime ReceivedDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalValue { get; set; }
    public decimal TotalQuantityAccepted { get; set; }
    public decimal TotalQuantityRejected { get; set; }
    public bool IsAiVerified { get; set; }
    public bool IsPostedToInventory { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<GoodsReceivedNoteLineDto> Lines { get; set; } = new();
}

public class GoodsReceivedNoteLineDto
{
    public Guid Id { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string? ItemName { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime? ManufacturedDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public decimal QuantityOrdered { get; set; }
    public decimal QuantityReceived { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public string Condition { get; set; } = string.Empty;
    public bool IsBatchCreated { get; set; }
}
