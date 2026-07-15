using SriLankanCatering.Inventory.Domain.Entities;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface INotificationRepository : IRepository<Notification>
{
    Task<IReadOnlyList<Notification>> GetUnreadByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Notification>> GetByUserIdAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);
    Task MarkAsReadAsync(Guid notificationId, CancellationToken cancellationToken = default);
    Task MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default);
}

public interface IAuditLogRepository : IRepository<AuditLog>
{
    Task<IReadOnlyList<AuditLog>> GetByUserAsync(Guid userId, DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AuditLog>> GetByModuleAsync(string module, DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AuditLog>> GetRecentAsync(int count, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AuditLog>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);
}
