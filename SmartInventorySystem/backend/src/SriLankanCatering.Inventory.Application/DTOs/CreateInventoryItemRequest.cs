namespace SriLankanCatering.Inventory.Application.DTOs;

public class CreateInventoryItemRequest
{
    public required string ItemCode { get; set; }
    public required string Name { get; set; }
    public string? AlternativeNames { get; set; }
    public string? Description { get; set; }
    public required Guid CategoryId { get; set; }
    public required Guid PrimarySupplierId { get; set; }
    public required string UnitOfMeasure { get; set; }
    public decimal ReorderLevel { get; set; }
    public decimal ReorderQuantity { get; set; }
    public decimal MaximumStockLevel { get; set; }
    public decimal MinimumStockLevel { get; set; }
    public decimal StandardCost { get; set; }
    public decimal CurrentPrice { get; set; }
    public required string StorageType { get; set; }
    public required string TemperatureZone { get; set; }
    public int ShelfLifeDays { get; set; }
    public bool IsPerishable { get; set; } = true;
    public bool IsBatchTracked { get; set; } = true;
    public string? Barcode { get; set; }
    public string? QrCode { get; set; }
    public string? Brand { get; set; }
    public string? CountryOfOrigin { get; set; }
    public string? HsnCode { get; set; }
    public string? SearchKeywords { get; set; }
    public string? ImageUrl { get; set; }
}

// UpdateInventoryItemRequest is defined in RequestDtos.cs
