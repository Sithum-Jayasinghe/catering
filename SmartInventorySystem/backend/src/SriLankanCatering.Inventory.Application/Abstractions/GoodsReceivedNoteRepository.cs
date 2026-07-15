
using SriLankanCatering.Inventory.Domain.Entities;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface IGoodsReceivedNoteRepository : IRepository<GoodsReceivedNote>
{
    Task<GoodsReceivedNote?> GetWithLinesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<GoodsReceivedNote?> GetByGrnNumberAsync(string grnNumber, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GoodsReceivedNote>> GetPendingVerificationAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GoodsReceivedNote>> GetByPurchaseOrderAsync(Guid purchaseOrderId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GoodsReceivedNote>> GetBySupplierAsync(Guid supplierId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GoodsReceivedNote>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default);
}
