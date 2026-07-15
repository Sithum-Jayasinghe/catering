using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain;
using SriLankanCatering.Inventory.Domain.Enums;
using SriLankanCatering.Inventory.Infrastructure.Configurations;
using SriLankanCatering.Inventory.Infrastructure.Persistence;

namespace SriLankanCatering.Inventory.Infrastructure.Repositories;

public class NotificationRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<Notification>(ctx, settings), INotificationRepository
{
    public async Task<IReadOnlyList<Notification>> GetUnreadByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await _context.Notifications.Where(n => n.UserId == userId && !n.IsRead).ToListAsync(ct);

    public async Task<IReadOnlyList<Notification>> GetByUserIdAsync(Guid userId, int page, int pageSize, CancellationToken ct = default)
        => await _context.Notifications.Where(n => n.UserId == userId).OrderByDescending(n => n.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct = default)
        => await _context.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead, ct);

    public async Task MarkAsReadAsync(Guid notificationId, CancellationToken ct = default)
    {
        var notification = await _context.Notifications.FindAsync([notificationId], ct);
        if (notification != null) { notification.IsRead = true; notification.ReadAt = DateTime.UtcNow; }
    }

    public async Task MarkAllAsReadAsync(Guid userId, CancellationToken ct = default)
    {
        var notifications = await _context.Notifications.Where(n => n.UserId == userId && !n.IsRead).ToListAsync(ct);
        foreach (var n in notifications) { n.IsRead = true; n.ReadAt = DateTime.UtcNow; }
    }
}

public class AuditLogRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<AuditLog>(ctx, settings), IAuditLogRepository
{
    public async Task<IReadOnlyList<AuditLog>> GetByUserAsync(Guid userId, DateTime from, DateTime to, CancellationToken ct = default)
        => await _context.AuditLogs.Where(a => a.UserId == userId && a.CreatedAt >= from && a.CreatedAt <= to).ToListAsync(ct);

    public async Task<IReadOnlyList<AuditLog>> GetByModuleAsync(string module, DateTime from, DateTime to, CancellationToken ct = default)
        => await _context.AuditLogs.Where(a => a.Module == module && a.CreatedAt >= from && a.CreatedAt <= to).ToListAsync(ct);

    public async Task<IReadOnlyList<AuditLog>> GetRecentAsync(int count, CancellationToken ct = default)
        => await _context.AuditLogs.OrderByDescending(a => a.CreatedAt).Take(count).ToListAsync(ct);

    public async Task<IReadOnlyList<AuditLog>> SearchAsync(string searchTerm, CancellationToken ct = default)
    {
        var term = searchTerm.ToLower();
        return await _context.AuditLogs.Where(a => a.Action.Contains(term) || (a.EntityName != null && a.EntityName.Contains(term))).ToListAsync(ct);
    }
}
