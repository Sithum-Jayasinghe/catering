namespace SriLankanCatering.Inventory.Domain.Enums;

public enum InventoryStatus
{
    Available = 1,
    LowStock = 2,
    OutOfStock = 3,
    Backordered = 4,
    Discontinued = 5,
    OnOrder = 6
}

public enum StockMovementType
{
    Receiving = 1,
    Issuing = 2,
    TransferIn = 3,
    TransferOut = 4,
    Adjustment = 5,
    Return = 6,
    Damage = 7,
    Consumption = 8,
    Waste = 9
}

public enum MovementSource
{
    PurchaseOrder = 1,
    GoodsReceivedNote = 2,
    GoodsIssue = 3,
    StockTransfer = 4,
    CycleCount = 5,
    Production = 6,
    Return = 7,
    Damage = 8,
    ManualAdjustment = 9,
    AiSuggestion = 10
}
