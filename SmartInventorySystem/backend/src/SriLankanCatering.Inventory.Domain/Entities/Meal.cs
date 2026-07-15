namespace SriLankanCatering.Inventory.Domain.Entities;

public class Meal : BaseEntity
{
    public required string MealCode { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string MealType { get; set; }
    public string? Category { get; set; }
    public int DefaultServings { get; set; }
    public decimal StandardCost { get; set; }
    public decimal SalesPrice { get; set; }
    public TaxCategory TaxCategory { get; set; } = TaxCategory.Standard;
    public TimeSpan? PreparationTime { get; set; }
    public TimeSpan? CookingTime { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsSpecial { get; set; } = false;
    public string? NutritionalInfo { get; set; }
    public string? AllergenInfo { get; set; }
    public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
}

public enum TaxCategory
{
    Standard = 1,
    ZeroRated = 2,
    Exempt = 3,
    Reduced = 4
}
