namespace SriLankanCatering.Inventory.Application.DTOs;

// ── Supplier ─────────────────────────────────────────────────────────────
public class CreateSupplierRequest
{
    public string SupplierCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string? StreetAddress { get; set; }
    public string? City { get; set; }
    public string? Province { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? PaymentTerms { get; set; }
    public int LeadTimeDays { get; set; }
    public string? Notes { get; set; }
}

public class UpdateSupplierRequest
{
    public string Name { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string? StreetAddress { get; set; }
    public string? City { get; set; }
    public string? Province { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? PaymentTerms { get; set; }
    public int LeadTimeDays { get; set; }
    public string? Notes { get; set; }
}

// ── Warehouse ────────────────────────────────────────────────────────────
public class CreateWarehouseRequest
{
    public string WarehouseCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "General";
    public int Capacity { get; set; }
    public string? Location { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactPhone { get; set; }
}

public class UpdateWarehouseRequest
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "General";
    public int Capacity { get; set; }
    public string? Location { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactPhone { get; set; }
}

// ── Goods Issue ──────────────────────────────────────────────────────────
public class CreateGoodsIssueRequest
{
    public Guid WarehouseId { get; set; }
    public DateTime RequiredDate { get; set; }
    public string? Department { get; set; }
    public string? Purpose { get; set; }
    public string? Notes { get; set; }
    public List<GoodsIssueLineRequest> Lines { get; set; } = new();
}

public class GoodsIssueLineRequest
{
    public Guid ItemId { get; set; }
    public decimal Quantity { get; set; }
    public string? Notes { get; set; }
}

// ── Stock Transfer ───────────────────────────────────────────────────────
public class CreateStockTransferRequest
{
    public Guid FromWarehouseId { get; set; }
    public Guid ToWarehouseId { get; set; }
    public string? TransferReason { get; set; }
    public string? Notes { get; set; }
    public List<StockTransferLineRequest> Lines { get; set; } = new();
}

public class StockTransferLineRequest
{
    public Guid ItemId { get; set; }
    public decimal Quantity { get; set; }
    public string? Notes { get; set; }
}

// ── User ─────────────────────────────────────────────────────────────────
public class CreateUserRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "StoreKeeper";
    public string? Department { get; set; }
    public Guid? WarehouseId { get; set; }
}

public class UpdateUserRequest
{
    public string FullName { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string Role { get; set; } = string.Empty;
    public Guid? WarehouseId { get; set; }
}

// ── Inventory Item Update (expanded) ─────────────────────────────────────
public class UpdateInventoryItemRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? PrimarySupplierId { get; set; }
    public decimal ReorderLevel { get; set; }
    public decimal ReorderQuantity { get; set; }
    public string? UnitOfMeasure { get; set; }
    public decimal? StandardCost { get; set; }
    public decimal? CurrentPrice { get; set; }
    public string? StorageType { get; set; }
    public string? TemperatureZone { get; set; }
    public int? ShelfLifeDays { get; set; }
    public bool? IsPerishable { get; set; }
    public bool? IsBatchTracked { get; set; }
    public bool? IsActive { get; set; }
}

// ── Category ─────────────────────────────────────────────────────────────
public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
}

public class UpdateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ParentCategoryId { get; set; }
}

// ── Notification ─────────────────────────────────────────────────────────
public class CreateNotificationRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Info";
    public Guid? UserId { get; set; }
}

// ── AI Chat ──────────────────────────────────────────────────────────────
public class AiChatRequest
{
    public string Message { get; set; } = string.Empty;
    public string? ConversationId { get; set; }
    public string? AgentType { get; set; }
}

// ── Pagination ───────────────────────────────────────────────────────────
public class PagedResult<T>
{
    public IReadOnlyList<T> Data { get; set; } = new List<T>();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}
