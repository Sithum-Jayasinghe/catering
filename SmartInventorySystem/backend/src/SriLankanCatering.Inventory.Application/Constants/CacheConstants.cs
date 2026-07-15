using Microsoft.Extensions.Caching.Distributed;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public static class CacheKeys
{
    public const string InventoryItemsPrefix = "inventory:items:";
    public const string AllInventoryItems = "inventory:items:all";
    public const string LowStockItems = "inventory:items:low-stock";
    public const string ExpiringItems = "inventory:items:expiring:";
    public const string ExpiredItems = "inventory:items:expired";
    public const string DashboardStats = "dashboard:stats";
    public const string Categories = "inventory:categories";
    public const string Suppliers = "inventory:suppliers";
    public const string Warehouses = "inventory:warehouses";
    public const string UnreadNotifications = "notifications:unread:";
    public static string UserPermissions(Guid userId) => $"users:{userId}:permissions";
    public static string Forecast(Guid itemId) => $"forecast:item:{itemId}";
    public static string SupplierPerformance(Guid supplierId) => $"supplier:{supplierId}:performance";
}

public static class CacheTtl
{
    public static readonly TimeSpan InventoryItems = TimeSpan.FromMinutes(5);
    public static readonly TimeSpan LowStock = TimeSpan.FromMinutes(2);
    public static readonly TimeSpan Expiring = TimeSpan.FromMinutes(10);
    public static readonly TimeSpan Dashboard = TimeSpan.FromMinutes(1);
    public static readonly TimeSpan ReferenceData = TimeSpan.FromHours(1);
    public static readonly TimeSpan UserPermissions = TimeSpan.FromMinutes(30);
}
