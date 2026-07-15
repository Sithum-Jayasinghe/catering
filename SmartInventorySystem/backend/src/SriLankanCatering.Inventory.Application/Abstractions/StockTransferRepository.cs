using SriLankanCatering.Inventory.Domain.Entities;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface IStockTransferRepository : IRepository<StockTransfer>
{
    Task<StockTransfer?> GetWithLinesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<StockTransfer?> GetByTransferNumberAsync(string transferNumber, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockTransfer>> GetInTransitAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockTransfer>> GetByFromWarehouseAsync(Guid warehouseId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StockTransfer>> GetByToWarehouseAsync(Guid warehouseId, CancellationToken cancellationToken = default);
}
