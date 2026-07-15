using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class AuditLog : BaseEntity
{
    public required Guid UserId { get; set; }
    public required string Action { get; set; }
    public string? EntityType { get; set; }
    public Guid? EntityId { get; set; }
    public string? EntityName { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Module { get; set; }
    public string? SubModule { get; set; }
    public string? SessionId { get; set; }
    public AuditLogLevel Level { get; set; } = AuditLogLevel.Information;
    public string? Message { get; set; }
}

public enum AuditLogLevel
{
    Information = 1,
    Warning = 2,
    Error = 3,
    Critical = 4
}
