namespace SriLankanCatering.Inventory.Domain.Entities;

public class UserClaim : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public required string ClaimType { get; set; }
    public required string ClaimValue { get; set; }
}
