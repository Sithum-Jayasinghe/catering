using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Infrastructure.Configurations;
using SriLankanCatering.Inventory.Infrastructure.Persistence;
using SriLankanCatering.Inventory.Infrastructure.Repositories;
using SriLankanCatering.Inventory.Infrastructure.Services;

namespace SriLankanCatering.Inventory.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<DatabaseSettings>(configuration.GetSection("Database"));
        services.Configure<RedisSettings>(configuration.GetSection("Redis"));
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        services.AddStackExchangeRedisCache(opts =>
        {
            opts.Configuration = configuration.GetValue<string>("Redis:ConnectionString") ?? "localhost:6379";
            opts.InstanceName = configuration.GetValue<string>("Redis:InstanceName") ?? "InventoryCache:";
        });

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IInventoryItemRepository, Infrastructure.Repositories.InventoryItemRepository>();
        services.AddScoped<IGoodsReceivedNoteRepository, Infrastructure.Repositories.GoodsReceivedNoteRepository>();
        services.AddScoped<IGoodsIssueRepository, Infrastructure.Repositories.GoodsIssueRepository>();
        services.AddScoped<IPurchaseOrderRepository, Infrastructure.Repositories.PurchaseOrderRepository>();
        services.AddScoped<IStockTransferRepository, Infrastructure.Repositories.StockTransferRepository>();
        services.AddScoped<IStockMovementRepository, Infrastructure.Repositories.StockMovementRepository>();
        services.AddScoped<ISupplierRepository, Infrastructure.Repositories.SupplierRepository>();
        services.AddScoped<IUserRepository, Infrastructure.Repositories.UserRepository>();
        services.AddScoped<INotificationRepository, Infrastructure.Repositories.NotificationRepository>();
        services.AddScoped<IAuditLogRepository, Infrastructure.Repositories.AuditLogRepository>();
        services.AddScoped<ICacheService, MemoryCacheService>();
        services.AddScoped<AuthService>();
        services.AddScoped<IDateTimeProvider, DateTimeProvider>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddHttpContextAccessor();

        return services;
    }
}
