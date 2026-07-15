namespace SriLankanCatering.Inventory.Domain.Entities;

public class AiConversation : BaseEntity
{
    public required Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public required Guid AgentTypeId { get; set; }
    public AiAgentType AgentType { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Topic { get; set; }
    public string? ContextData { get; set; }
    public string? Summary { get; set; }
    public double SatisfactionRating { get; set; }
    public string? Feedback { get; set; }
}
