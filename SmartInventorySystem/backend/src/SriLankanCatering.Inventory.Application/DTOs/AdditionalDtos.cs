namespace SriLankanCatering.Inventory.Application.DTOs;

public record GoodsIssueDto(Guid Id, string IssueNumber, Guid WarehouseId, string Status, DateTime RequiredDate, Guid RequestedBy, DateTime CreatedAt);
public record StockTransferDto(Guid Id, string TransferNumber, Guid FromWarehouseId, Guid ToWarehouseId, string Status, DateTime CreatedAt);
public record SupplierDto(Guid Id, string SupplierCode, string Name, string ContactPerson, string ContactEmail, double Rating, string Status, DateTime CreatedAt);
public record WarehouseDto(Guid Id, string WarehouseCode, string Name, string Type, bool IsActive, int Capacity, DateTime CreatedAt);
public record UserDto(Guid Id, string UserCode, string FullName, string Email, string Role, string Status, string? Department, DateTime CreatedAt);
