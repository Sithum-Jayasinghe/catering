using SriLankanCatering.Inventory.Domain.Entities;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface IInventoryItemRepository : IRepository<InventoryItem>
{
    Task<InventoryItem?> GetByItemCodeAsync(string itemCode, CancellationToken cancellationToken = default);
    Task<InventoryItem?> GetSlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InventoryItem>> GetLowStockItemsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InventoryItem>> GetExpiringItemsAsync(int daysThreshold, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InventoryItem>> GetExpiredItemsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InventoryItem>> GetByCategoryAsync(Guid categoryId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InventoryItem>> GetBySupplierAsync(Guid supplierId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InventoryItem>> GetByWarehouseAsync(Guid warehouseId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InventoryItem>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);
    Task<Dictionary<string, int>> GetCategoryDistributionAsync(CancellationToken cancellationToken = default);
}
