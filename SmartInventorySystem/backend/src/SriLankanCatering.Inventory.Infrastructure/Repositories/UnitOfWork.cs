using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Infrastructure.Configurations;
using SriLankanCatering.Inventory.Infrastructure.Persistence;

namespace SriLankanCatering.Inventory.Infrastructure.Repositories;

public class UnitOfWork(InventoryDbContext context, IOptions<DatabaseSettings> settings) : IUnitOfWork
{
    private InventoryDbContext _context = context;

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _context.SaveChangesAsync(cancellationToken);
            return 1;
        }
        catch
        {
            return 0;
        }
    }

    public async Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in _context.ChangeTracker.Entries())
        {
            switch (entry.State)
            {
                case EntityState.Modified: entry.State = EntityState.Unchanged; break;
                case EntityState.Added: entry.State = EntityState.Detached; break;
                case EntityState.Deleted: entry.State = EntityState.Unchanged; break;
            }
        }
        await Task.CompletedTask;
    }

    public void Dispose() => _context.Dispose();
}
