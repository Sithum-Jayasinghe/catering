namespace SriLankanCatering.Inventory.Domain.Entities;

public class Warehouse : BaseEntity
{
    public required string WarehouseCode { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Type { get; set; }
    public required string Status { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public int Capacity { get; set; }
    public int CurrentOccupancy { get; set; } = 0;
    public string? OperatingHours { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime OpenedDate { get; set; }
    public string? ManagerId { get; set; }
    public bool IsColdStorage { get; set; }
    public bool IsDryStorage { get; set; }
    public ICollection<StorageLocation> StorageLocations { get; set; } = new List<StorageLocation>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
