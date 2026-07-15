namespace SriLankanCatering.Inventory.Domain.Entities;

public class Recipe : BaseEntity
{
    public required string RecipeCode { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required Guid MealId { get; set; }
    public Meal Meal { get; set; } = null!;
    public int ServingSize { get; set; }
    public string? CookingInstructions { get; set; }
    public TimeSpan? PreparationTime { get; set; }
    public TimeSpan? CookingTime { get; set; }
    public int PortionSize { get; set; }
    public string? Category { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public required Guid CreatedById { get; set; }
    public Guid? ApprovedById { get; set; }
    public string? AiOptimizationNotes { get; set; }
    public ICollection<MealIngredient> Ingredients { get; set; } = new List<MealIngredient>();
}
