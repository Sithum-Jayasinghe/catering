namespace SriLankanCatering.Inventory.Application.DTOs;

public class InventoryItemDto
{
    public Guid Id { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AlternativeNames { get; set; }
    public string? Description { get; set; }
    public Guid CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public Guid PrimarySupplierId { get; set; }
    public string? SupplierName { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public decimal ReorderLevel { get; set; }
    public decimal ReorderQuantity { get; set; }
    public decimal StandardCost { get; set; }
    public decimal TotalQuantityOnHand { get; set; }
    public decimal TotalReservedQuantity { get; set; }
    public decimal TotalQuantityAvailable { get; set; }
    public decimal AverageUnitCost { get; set; }
    public decimal TotalInventoryValue { get; set; }
    public string Status { get; set; } = string.Empty;
    public string StorageType { get; set; } = string.Empty;
    public string TemperatureZone { get; set; } = string.Empty;
    public bool IsPerishable { get; set; }
    public int ShelfLifeDays { get; set; }
    public bool IsBatchTracked { get; set; }
    public bool IsActive { get; set; }
    public bool IsDiscontinued { get; set; }
    public string? Barcode { get; set; }
    public string? QrCode { get; set; }
    public string? Brand { get; set; }
    public DateTime? LastReceiptDate { get; set; }
    public DateTime? LastIssueDate { get; set; }
    public DateTime? LastForecastDate { get; set; }
    public decimal PredictedDemand { get; set; }
    public string? AISummary { get; set; }
    public int BatchCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? ImageUrl { get; set; }
}
