using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class AiAgentRun : BaseEntity
{
    public required AiAgentType AgentType { get; set; }
    public required Guid InitiatedBy { get; set; }
    public AiTaskStatus Status { get; set; } = AiTaskStatus.Pending;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Prompt { get; set; }
    public string? Response { get; set; }
    public string? ErrorMessage { get; set; }
    public int TokensUsed { get; set; } = 0;
    public TimeSpan Duration { get; set; }
    public string? ContextData { get; set; }
    public string? ActionsPerformed { get; set; }
    public string? ConfidenceScore { get; set; }
    public bool RequiresHumanApproval { get; set; }
    public Guid? ApprovedById { get; set; }
    public DateTime? ApprovedAt { get; set; }
}
