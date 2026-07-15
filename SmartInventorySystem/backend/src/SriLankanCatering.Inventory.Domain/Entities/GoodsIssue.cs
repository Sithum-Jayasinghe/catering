using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class GoodsIssue : BaseEntity
{
    public required string IssueNumber { get; set; }
    public Guid? IssueRequestId { get; set; }
    public required Guid IssuanceToWarehouseId { get; set; }
    public Warehouse IssuanceToWarehouse { get; set; } = null!;
    public required Guid WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public required Guid RequestedBy { get; set; }
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public Guid? IssuedBy { get; set; }
    public DateTime? IssuedAt { get; set; }
    public GoodsIssueStatus Status { get; set; } = GoodsIssueStatus.Draft;
    public DateTime RequiredDate { get; set; }
    public required string RequestType { get; set; } = "Kitchen";
    public bool IsProductionConsumption { get; set; }
    public Guid? MealId { get; set; }
    public string? Notes { get; set; }
    public string? AiRecommendation { get; set; }
    public ICollection<GoodsIssueLine> Lines { get; set; } = new List<GoodsIssueLine>();
}
