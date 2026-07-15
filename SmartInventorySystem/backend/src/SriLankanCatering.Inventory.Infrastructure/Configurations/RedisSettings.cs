namespace SriLankanCatering.Inventory.Infrastructure.Configurations;

public class RedisSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string InstanceName { get; set; } = "InventoryCache:";
    public int DefaultTtlSeconds { get; set; } = 3600;
    public bool EnableCompression { get; set; } = true;
    public int Database { get; set; } = 0;
    public string? Password { get; set; }
}
