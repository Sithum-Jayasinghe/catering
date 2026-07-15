namespace SriLankanCatering.Inventory.Domain.Entities;

public class UserRolePermission : BaseEntity
{
    public required UserRole Role { get; set; }
    public required string Permission { get; set; }
    public required string Module { get; set; }
    public bool CanCreate { get; set; }
    public bool CanRead { get; set; }
    public bool CanUpdate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanApprove { get; set; }
    public DateTime GrantedAt { get; set; }
    public Guid? GrantedBy { get; set; }
}
