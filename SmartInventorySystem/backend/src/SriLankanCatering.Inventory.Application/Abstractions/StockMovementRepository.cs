using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface IStockMovementRepository : IRepository<StockMovement>
{
    Task<IReadOnlyList<StockMovement>> GetByItemAsync(Guid itemId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockMovement>> GetByWarehouseAsync(Guid warehouseId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockMovement>> GetByBatchAsync(Guid batchId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockMovement>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<decimal> GetTotalMovementByItemAsync(Guid itemId, StockMovementType type, CancellationToken cancellationToken = default);
}
