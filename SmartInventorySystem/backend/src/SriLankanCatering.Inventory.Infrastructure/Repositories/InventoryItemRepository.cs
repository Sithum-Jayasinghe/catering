using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;
using SriLankanCatering.Inventory.Infrastructure.Configurations;
using SriLankanCatering.Inventory.Infrastructure.Persistence;
using SriLankanCatering.Inventory.Infrastructure.Repositories;

namespace SriLankanCatering.Inventory.Infrastructure.Repositories;

public class InventoryItemRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<InventoryItem>(ctx, settings), IInventoryItemRepository
{
    public async Task<InventoryItem?> GetByItemCodeAsync(string itemCode, CancellationToken ct = default)
        => await _context.InventoryItems.FirstOrDefaultAsync(i => i.ItemCode == itemCode, ct);

    public async Task<InventoryItem?> GetSlugAsync(string slug, CancellationToken ct = default)
        => await _context.InventoryItems.FirstOrDefaultAsync(i => i.SearchKeywords != null && i.SearchKeywords.Contains(slug), ct);

    public async Task<IReadOnlyList<InventoryItem>> GetLowStockItemsAsync(CancellationToken ct = default)
        => await _context.InventoryItems.Where(i => i.IsActive && !i.IsDiscontinued && i.TotalQuantityOnHand <= i.ReorderLevel).ToListAsync(ct);

    public async Task<IReadOnlyList<InventoryItem>> GetExpiringItemsAsync(int daysThreshold, CancellationToken ct = default)
    {
        var expiry = DateTime.UtcNow.AddDays(daysThreshold);
        return await _context.InventoryItems
            .Where(i => i.IsActive && !i.IsDiscontinued && i.IsPerishable
                && _context.StockBatches.Any(b => b.ItemId == i.Id && b.RemainingQuantity > 0 && b.ExpiryDate <= expiry))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<InventoryItem>> GetExpiredItemsAsync(CancellationToken ct = default)
        => await _context.InventoryItems.Where(i => i.IsActive && !i.IsDiscontinued
            && _context.StockBatches.Any(b => b.ItemId == i.Id && b.RemainingQuantity > 0 && b.ExpiryDate < DateTime.UtcNow)).ToListAsync(ct);

    public async Task<IReadOnlyList<InventoryItem>> GetByCategoryAsync(Guid categoryId, CancellationToken ct = default)
        => await _context.InventoryItems.Where(i => i.CategoryId == categoryId).ToListAsync(ct);

    public async Task<IReadOnlyList<InventoryItem>> GetBySupplierAsync(Guid supplierId, CancellationToken ct = default)
        => await _context.InventoryItems.Where(i => i.PrimarySupplierId == supplierId).ToListAsync(ct);

    public async Task<IReadOnlyList<InventoryItem>> GetByWarehouseAsync(Guid warehouseId, CancellationToken ct = default)
        => await _context.InventoryItems
            .Where(i => _context.StockBatches.Any(b => b.ItemId == i.Id && b.WarehouseId == warehouseId)).ToListAsync(ct);

    public async Task<IReadOnlyList<InventoryItem>> SearchAsync(string searchTerm, CancellationToken ct = default)
    {
        var term = searchTerm.ToLower();
        return await _context.InventoryItems
            .Where(i => i.Name.ToLower().Contains(term) || i.ItemCode.ToLower().Contains(term) || (i.AlternativeNames != null && i.AlternativeNames.ToLower().Contains(term)))
            .ToListAsync(ct);
    }

    public async Task<Dictionary<string, int>> GetCategoryDistributionAsync(CancellationToken ct = default)
    {
        return await _context.InventoryItems.Where(i => i.IsActive)
            .GroupBy(i => i.Category.Name)
            .Select(g => new { Category = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Category, x => x.Count, ct);
    }
}
