namespace SriLankanCatering.Inventory.Domain.Entities;

public class Category : BaseEntity
{
    public required string Name { get; set; }
    public string? Code { get; set; }
    public required string Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
    public required string CreatedBy { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public string? Icon { get; set; }
    public ICollection<InventoryItem> Items { get; set; } = new List<InventoryItem>();
}
