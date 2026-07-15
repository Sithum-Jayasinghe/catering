using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class CycleCount : BaseEntity
{
    public required string CountNumber { get; set; }
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public required Guid StorageLocationId { get; set; }
    public StorageLocation StorageLocation { get; set; } = null!;
    public required Guid CountedBy { get; set; }
    public Guid? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public Guid? RecountedBy { get; set; }
    public DateTime CountDate { get; set; }
    public CycleCountStatus Status { get; set; } = CycleCountStatus.Pending;
    public required string CountType { get; set; }
    public bool IsAiAssisted { get; set; }
    public string? AiAnalysis { get; set; }
    public string? Notes { get; set; }
    public ICollection<CycleCountLine> Lines { get; set; } = new List<CycleCountLine>();
}

public enum CycleCountStatus
{
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Reviewed = 4,
    Adjusted = 5,
    Cancelled = 6
}
