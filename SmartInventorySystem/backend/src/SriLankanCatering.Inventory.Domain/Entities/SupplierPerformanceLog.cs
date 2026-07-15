namespace SriLankanCatering.Inventory.Domain.Entities;

public class SupplierPerformanceLog : BaseEntity
{
    public required Guid SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public required DateTime EvaluationDate { get; set; }
    public required int TotalOrders { get; set; }
    public required int OnTimeDeliveries { get; set; }
    public required int LateDeliveries { get; set; }
    public required int TotalRejected { get; set; }
    public double OnTimeDeliveryRate { get; set; }
    public double QualityRate { get; set; }
    public double AverageLeadTime { get; set; }
    public double Rating { get; set; }
    public string? AiInsight { get; set; }
    public string? ReviewerNotes { get; set; }
    public Guid? ReviewedById { get; set; }
}
