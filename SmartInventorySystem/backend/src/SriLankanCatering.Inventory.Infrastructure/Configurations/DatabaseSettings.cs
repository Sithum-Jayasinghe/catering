namespace SriLankanCatering.Inventory.Infrastructure.Configurations;

public class DatabaseSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string MigrationsAssembly { get; set; } = "SriLankanCatering.Inventory.Infrastructure";
    public int CommandTimeoutSeconds { get; set; } = 60;
    public bool EnableSensitiveDataLogging { get; set; } = false;
    public bool EnableDetailedErrors { get; set; } = false;
    public int PoolSize { get; set; } = 1024;
    public string? DatabaseName { get; set; } = "SriLankanCateringInventoryDB";
}
