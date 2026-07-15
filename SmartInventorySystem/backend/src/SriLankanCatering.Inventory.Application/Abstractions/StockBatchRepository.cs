using SriLankanCatering.Inventory.Domain.Entities;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface IStockBatchRepository : IRepository<StockBatch>
{
    Task<StockBatch?> GetByBatchNumberAsync(string batchNumber, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockBatch>> GetByItemIdAsync(Guid itemId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockBatch>> GetExpiringBatchesAsync(int daysThreshold, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockBatch>> GetExpiredBatchesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockBatch>> GetByWarehouseAsync(Guid warehouseId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockBatch>> GetByLocationAsync(Guid locationId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockBatch>> GetLowStockBatchesAsync(CancellationToken cancellationToken = default);
}
