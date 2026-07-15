using System.ComponentModel.DataAnnotations.Schema;

namespace SriLankanCatering.Inventory.Domain.Entities;

[NotMapped]
public class AiMcpConnection : BaseEntity
{
    public required string ConnectionName { get; set; }
    public required string McpToolName { get; set; }
    public required MCPToolType ToolType { get; set; }
    public required string ServerUrl { get; set; }
    public required string ApiKey { get; set; }
    public string? ApiSecret { get; set; }
    public string? AuthType { get; set; }
    public string? Headers { get; set; }
    public bool IsActive { get; set; }
    public int TimeoutSeconds { get; set; }
    public int RetryCount { get; set; } = 3;
    public string? Description { get; set; }
    public string? AllowedScopes { get; set; }
}
