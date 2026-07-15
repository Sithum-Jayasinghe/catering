using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class StockTransfer : BaseEntity
{
    public required string TransferNumber { get; set; }
    public required Guid FromWarehouseId { get; set; }
    public Warehouse? FromWarehouse { get; set; }
    public required Guid ToWarehouseId { get; set; }
    public Warehouse? ToWarehouse { get; set; }
    public Guid TransferRequestedBy { get; set; }
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public Guid? ShippedBy { get; set; }
    public DateTime? ShippedAt { get; set; }
    public Guid? ReceivedBy { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public StockTransferStatus Status { get; set; } = StockTransferStatus.Draft;
    public DateTime ExpectedDeliveryDate { get; set; }
    public DateTime? ActualDeliveryDate { get; set; }
    public string? VehicleNumber { get; set; }
    public string? DriverName { get; set; }
    public string? DriverContact { get; set; }
    public string? Notes { get; set; }
    public Money TotalValue { get; set; } = new(0, "LKR");
    public ICollection<StockTransferLine> Lines { get; set; } = new List<StockTransferLine>();
}
