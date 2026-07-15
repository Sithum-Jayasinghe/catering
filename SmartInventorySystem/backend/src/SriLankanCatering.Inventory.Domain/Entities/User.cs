using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace SriLankanCatering.Inventory.Domain.Entities;

public class User : BaseEntity
{
    public string UserCode { get; set; } = string.Empty;
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string FullName => $"{FirstName} {LastName}";
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required string PasswordHash { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    public UserRole Role { get; set; } = UserRole.StoreKeeper;
    public UserStatus Status { get; set; } = UserStatus.Pending;
    public string? ProfilePictureUrl { get; set; }
    public string? Department { get; set; }
    public string? Designation { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? LastLoginIp { get; set; }
    public int FailedLoginAttempts { get; set; } = 0;
    public DateTime? LockedUntil { get; set; }
    public bool MustChangePassword { get; set; } = true;
    public required Guid? WarehouseId { get; set; }
    public Warehouse? Warehouse { get; set; }
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    public ICollection<UserClaim> UserClaims { get; set; } = new List<UserClaim>();
}
