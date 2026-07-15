namespace SriLankanCatering.Inventory.Domain.Entities;

public class AiConversationMessage : BaseEntity
{
    public required Guid AiConversationId { get; set; }
    public AiConversation AiConversation { get; set; } = null!;
    public MessageRole Role { get; set; }
    public required string Content { get; set; }
    public string? Attachments { get; set; }
    public string? ToolCalls { get; set; }
    public string? ToolResults { get; set; }
    public int TokensUsed { get; set; } = 0;
    public TimeSpan ProcessingTime { get; set; }
    public string? ConfidenceScore { get; set; }
    public AiTaskStatus Status { get; set; } = AiTaskStatus.Completed;
    public string? ErrorMessage { get; set; }
}

public enum MessageRole
{
    User = 1,
    Assistant = 2,
    System = 3,
    Tool = 4
}
