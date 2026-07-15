using SriLankanCatering.Inventory.Domain.Entities;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface IGoodsIssueRepository : IRepository<GoodsIssue>
{
    Task<GoodsIssue?> GetWithLinesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<GoodsIssue?> GetByIssueNumberAsync(string issueNumber, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GoodsIssue>> GetPendingApprovalAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GoodsIssue>> GetByWarehouseAsync(Guid warehouseId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<GoodsIssue>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default);
}
