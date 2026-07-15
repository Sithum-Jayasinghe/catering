using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Application.Abstractions;

public interface ISupplierRepository : IRepository<Supplier>
{
    Task<Supplier?> GetBySupplierCodeAsync(string supplierCode, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Supplier>> GetActiveSuppliersAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Supplier>> GetTopPerformersAsync(int count, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Supplier>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);
}

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetByUserCodeAsync(string userCode, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<User>> GetActiveUsersAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<User>> GetByRoleAsync(UserRole role, CancellationToken cancellationToken = default);
}
