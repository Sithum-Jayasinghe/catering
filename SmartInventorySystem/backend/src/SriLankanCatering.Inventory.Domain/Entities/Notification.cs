using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class Notification : BaseEntity
{
    public required Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string? Title { get; set; }
    public required string Message { get; set; }
    public required NotificationType Type { get; set; }
    public required NotificationChannel Channel { get; set; }
    public required NotificationPriority Priority { get; set; }
    public string? ContextData { get; set; }
    public string? ActionUrl { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime? DismissedAt { get; set; }
    public bool IsRead { get; set; } = false;
    public bool IsDismissed { get; set; } = false;
    public string? ErrorMessage { get; set; }
    public int RetryCount { get; set; } = 0;
    public DateTime? LastRetryAt { get; set; }
}
