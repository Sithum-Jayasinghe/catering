using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class Supplier : BaseEntity
{
    public required string SupplierCode { get; set; }
    public required string Name { get; set; }
    public required string RegistrationNumber { get; set; }
    public string? LegalName { get; set; }
    public string? Description { get; set; }
    public required string ContactPerson { get; set; }
    public required string ContactEmail { get; set; }
    public required string ContactPhone { get; set; }
    public required string ContactFax { get; set; }
    public Address? Address { get; set; }
    public string? Website { get; set; }
    public string? TaxId { get; set; }
    public string? VatNumber { get; set; }
    public string? PaymentTerms { get; set; }
    public int CreditLimit { get; set; }
    public decimal OutstandingBalance { get; set; } = 0;
    public SupplierStatus Status { get; set; } = SupplierStatus.Active;
    public SupplierCategory Category { get; set; } = SupplierCategory.Regular;
    public string? PreferredCurrency { get; set; } = "LKR";
    public string? PaymentMethod { get; set; }
    public string? BankDetails { get; set; }
    public string? FoodSafetyCertification { get; set; }
    public DateTime? FoodSafetyExpiry { get; set; }
    public double OnTimeDeliveryRate { get; set; } = 0;
    public double QualityRate { get; set; } = 100;
    public double AverageLeadTimeDays { get; set; } = 0;
    public decimal TotalOrders { get; set; } = 0;
    public decimal TotalValue { get; set; } = 0;
    public double Rating { get; set; } = 0;
    public string? Notes { get; set; }
    public string? DocumentsPath { get; set; }
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
    public ICollection<GoodsReceivedNote> GoodsReceivedNotes { get; set; } = new List<GoodsReceivedNote>();
    public ICollection<InventoryItemSupplier> InventoryItemSuppliers { get; set; } = new List<InventoryItemSupplier>();
    public ICollection<SupplierPerformanceLog> PerformanceLogs { get; set; } = new List<SupplierPerformanceLog>();
}

public enum SupplierStatus
{
    Active = 1,
    Inactive = 2,
    Suspended = 3,
    UnderReview = 4,
    Blocked = 5
}

public enum SupplierCategory
{
    Strategic = 1,
    Regular = 2,
    Spot = 3,
    Emergency = 4
}
