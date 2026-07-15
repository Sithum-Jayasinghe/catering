using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class IngredientDemand : BaseEntity
{
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public Guid? RecipeId { get; set; }
    public string? MealName { get; set; }
    public DateTime DemandDate { get; set; }
    public required int Servings { get; set; }
    public required decimal QuantityRequired { get; set; }
    public required string UnitOfMeasure { get; set; }
    public decimal ActualConsumed { get; set; } = 0;
    public decimal Variance { get; set; } = 0;
    public decimal EstimatedCost { get; set; } = 0;
    public DemandStatus Status { get; set; } = DemandStatus.Forecasted;
    public DateTime? ConsumedAt { get; set; }
    public Guid? ProcessedBy { get; set; }
    public string? AiRecommendation { get; set; }
    public DateTime? AiGeneratedDate { get; set; }
}

public enum DemandStatus
{
    Forecasted = 1,
    Planned = 2,
    Consumed = 3,
    Adjusted = 4,
    Cancelled = 5
}
