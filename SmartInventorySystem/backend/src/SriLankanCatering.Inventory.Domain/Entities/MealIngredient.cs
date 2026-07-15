namespace SriLankanCatering.Inventory.Domain.Entities;

public class MealIngredient : BaseEntity
{
    public required Guid RecipeId { get; set; }
    public Recipe Recipe { get; set; } = null!;
    public required Guid ItemId { get; set; }
    public InventoryItem Item { get; set; } = null!;
    public required decimal Quantity { get; set; }
    public required string UnitOfMeasure { get; set; }
    public string? Notes { get; set; }
    public int SortOrder { get; set; }
    public string? Substitution { get; set; }
    public bool IsOptional { get; set; }
    public decimal AllowedDeviation { get; set; }
}
