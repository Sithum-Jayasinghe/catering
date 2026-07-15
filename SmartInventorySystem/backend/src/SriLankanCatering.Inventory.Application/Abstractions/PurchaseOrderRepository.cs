using SriLankanCatering.Inventory.Domain;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface IPurchaseOrderRepository : IRepository<PurchaseOrder>
{
    Task<PurchaseOrder?> GetWithLinesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PurchaseOrder?> GetByPONumberAsync(string poNumber, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PurchaseOrder>> GetPendingApprovalAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PurchaseOrder>> GetBySupplierAsync(Guid supplierId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PurchaseOrder>> GetByStatusAsync(PurchaseOrderStatus status, CancellationToken cancellationToken = default);
}
