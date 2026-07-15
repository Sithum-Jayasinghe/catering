namespace SriLankanCatering.Inventory.Domain.Enums;

public enum UserRole
{
    Administrator = 1,
    InventoryManager = 2,
    StoreKeeper = 3,
    KitchenManager = 4,
    ProcurementOfficer = 5,
    FinanceOfficer = 6,
    Auditor = 7,
    Supplier = 8
}

public enum UserStatus
{
    Active = 1,
    Inactive = 2,
    Suspended = 3,
    Pending = 4
}
