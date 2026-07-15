namespace SriLankanCatering.Inventory.Application.DTOs;

public record CreateGoodsReceivedNoteRequest(
    Guid PurchaseOrderId, Guid SupplierId, Guid WarehouseId, Guid StorageLocationId, DateTime DeliveryDate);
