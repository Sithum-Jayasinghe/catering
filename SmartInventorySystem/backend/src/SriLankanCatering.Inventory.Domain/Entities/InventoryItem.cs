using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class InventoryItem : BaseEntity
{
    public required string ItemCode { get; set; }
    public required string Name { get; set; }
    public string? AlternativeNames { get; set; }
    public string? Description { get; set; }
    public required Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedBy { get; set; }
    public required Guid PrimarySupplierId { get; set; }
    public Supplier PrimarySupplier { get; set; } = null!;
    public required string UnitOfMeasure { get; set; }
    public decimal ReorderLevel { get; set; }
    public decimal ReorderQuantity { get; set; }
    public decimal MaximumStockLevel { get; set; }
    public decimal MinimumStockLevel { get; set; }
    public decimal StandardCost { get; set; }
    public Money CurrentPrice { get; set; } = new(0, "LKR");
    public required StorageType StorageType { get; set; }
    public required TemperatureZone TemperatureZone { get; set; }
    public int ShelfLifeDays { get; set; }
    public bool IsPerishable { get; set; } = true;
    public bool IsBatchTracked { get; set; } = true;
    public bool IsActive { get; set; } = true;
    public bool IsDiscontinued { get; set; } = false;
    public DateTime? DiscontinuedDate { get; set; }
    public string? Barcode { get; set; }
    public string? QrCode { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Specifications { get; set; }
    public string? CountryOfOrigin { get; set; }
    public decimal TotalQuantityOnHand { get; set; } = 0;
    public decimal TotalReservedQuantity { get; set; } = 0;
    public decimal TotalQuantityAvailable => TotalQuantityOnHand - TotalReservedQuantity;
    public decimal AverageUnitCost { get; set; } = 0;
    public Money TotalInventoryValue { get; set; } = new(0, "LKR");
    public InventoryStatus Status { get; set; } = InventoryStatus.Available;
    public string? HsnCode { get; set; }
    public string? VatCategory { get; set; }
    public string? SearchKeywords { get; set; }
    public string? AISummary { get; set; }
    public DateTime? LastReceiptDate { get; set; }
    public DateTime? LastIssueDate { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime? LastForecastDate { get; set; }
    public decimal PredictedDemand { get; set; } = 0;
    public double DemandVariabilityIndex { get; set; } = 0;
    public ICollection<StockBatch> Batches { get; set; } = new List<StockBatch>();
    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    public ICollection<StockTransferLine> StockTransferLines { get; set; } = new List<StockTransferLine>();
    public ICollection<StockAdjustmentLine> StockAdjustmentLines { get; set; } = new List<StockAdjustmentLine>();
    public ICollection<GoodsIssueLine> GoodsIssueLines { get; set; } = new List<GoodsIssueLine>();
    public ICollection<GoodsReceivedNoteLine> ReceivedNoteLines { get; set; } = new List<GoodsReceivedNoteLine>();
    public ICollection<PurchaseOrderLine> PurchaseOrderLines { get; set; } = new List<PurchaseOrderLine>();
    public ICollection<CycleCountLine> CycleCountLines { get; set; } = new List<CycleCountLine>();
    public ICollection<MealIngredient> MealIngredients { get; set; } = new List<MealIngredient>();
    public ICollection<IngredientDemand> IngredientDemands { get; set; } = new List<IngredientDemand>();
    public ICollection<InventoryItemSupplier> InventoryItemSuppliers { get; set; } = new List<InventoryItemSupplier>();
}
