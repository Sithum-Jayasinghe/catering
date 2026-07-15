using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class StorageLocation : BaseEntity
{
    public required string LocationCode { get; set; }
    public required string Name { get; set; }
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public required string Zone { get; set; }
    public required string Aisle { get; set; }
    public required string Rack { get; set; }
    public required string Shelf { get; set; }
    public required string Position { get; set; }
    public required StorageType StorageType { get; set; }
    public required TemperatureZone TemperatureZone { get; set; }
    public decimal MaxWeightCapacity { get; set; }
    public decimal CurrentWeight { get; set; } = 0;
    public decimal MaxVolumeCapacity { get; set; }
    public decimal CurrentVolume { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public string? Characteristics { get; set; }
    public string? Barcode { get; set; }
}
