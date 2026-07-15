using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;
using SriLankanCatering.Inventory.Infrastructure.Configurations;
using SriLankanCatering.Inventory.Infrastructure.Persistence;

namespace SriLankanCatering.Inventory.Infrastructure.Repositories;

public class GoodsReceivedNoteRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<GoodsReceivedNote>(ctx, settings), IGoodsReceivedNoteRepository
{
    public async Task<GoodsReceivedNote?> GetWithLinesAsync(Guid id, CancellationToken ct = default)
        => await _context.GoodsReceivedNotes.Include(g => g.Lines).FirstOrDefaultAsync(g => g.Id == id, ct);

    public async Task<GoodsReceivedNote?> GetByGrnNumberAsync(string grnNumber, CancellationToken ct = default)
        => await _context.GoodsReceivedNotes.FirstOrDefaultAsync(g => g.GrnNumber == grnNumber, ct);

    public async Task<IReadOnlyList<GoodsReceivedNote>> GetPendingVerificationAsync(CancellationToken ct = default)
        => await _context.GoodsReceivedNotes.Where(g => g.Status == GoodsReceivedNoteStatus.PendingVerification).ToListAsync(ct);

    public async Task<IReadOnlyList<GoodsReceivedNote>> GetByPurchaseOrderAsync(Guid purchaseOrderId, CancellationToken ct = default)
        => await _context.GoodsReceivedNotes.Where(g => g.PurchaseOrderId == purchaseOrderId).ToListAsync(ct);

    public async Task<IReadOnlyList<GoodsReceivedNote>> GetBySupplierAsync(Guid supplierId, CancellationToken ct = default)
        => await _context.GoodsReceivedNotes.Where(g => g.SupplierId == supplierId).ToListAsync(ct);

    public async Task<IReadOnlyList<GoodsReceivedNote>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken ct = default)
        => await _context.GoodsReceivedNotes.Where(g => g.CreatedAt >= from && g.CreatedAt <= to).ToListAsync(ct);
}

public class PurchaseOrderRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<PurchaseOrder>(ctx, settings), IPurchaseOrderRepository
{
    public async Task<PurchaseOrder?> GetWithLinesAsync(Guid id, CancellationToken ct = default)
        => await _context.PurchaseOrders.Include(p => p.Lines).FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<PurchaseOrder?> GetByPONumberAsync(string poNumber, CancellationToken ct = default)
        => await _context.PurchaseOrders.FirstOrDefaultAsync(p => p.PONumber == poNumber, ct);

    public async Task<IReadOnlyList<PurchaseOrder>> GetPendingApprovalAsync(CancellationToken ct = default)
        => await _context.PurchaseOrders.Where(p => p.Status == PurchaseOrderStatus.PendingApproval).ToListAsync(ct);

    public async Task<IReadOnlyList<PurchaseOrder>> GetBySupplierAsync(Guid supplierId, CancellationToken ct = default)
        => await _context.PurchaseOrders.Where(p => p.SupplierId == supplierId).ToListAsync(ct);

    public async Task<IReadOnlyList<PurchaseOrder>> GetByStatusAsync(PurchaseOrderStatus status, CancellationToken ct = default)
        => await _context.PurchaseOrders.Where(p => p.Status == status).ToListAsync(ct);
}

public class GoodsIssueRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<GoodsIssue>(ctx, settings), IGoodsIssueRepository
{
    public async Task<GoodsIssue?> GetWithLinesAsync(Guid id, CancellationToken ct = default)
        => await _context.GoodsIssues.Include(g => g.Lines).FirstOrDefaultAsync(g => g.Id == id, ct);

    public async Task<GoodsIssue?> GetByIssueNumberAsync(string issueNumber, CancellationToken ct = default)
        => await _context.GoodsIssues.FirstOrDefaultAsync(g => g.IssueNumber == issueNumber, ct);

    public async Task<IReadOnlyList<GoodsIssue>> GetPendingApprovalAsync(CancellationToken ct = default)
        => await _context.GoodsIssues.Where(g => g.Status == GoodsIssueStatus.PendingApproval).ToListAsync(ct);

    public async Task<IReadOnlyList<GoodsIssue>> GetByWarehouseAsync(Guid warehouseId, CancellationToken ct = default)
        => await _context.GoodsIssues.Where(g => g.WarehouseId == warehouseId).ToListAsync(ct);

    public async Task<IReadOnlyList<GoodsIssue>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken ct = default)
        => await _context.GoodsIssues.Where(g => g.CreatedAt >= from && g.CreatedAt <= to).ToListAsync(ct);
}

public class StockTransferRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<StockTransfer>(ctx, settings), IStockTransferRepository
{
    public async Task<StockTransfer?> GetWithLinesAsync(Guid id, CancellationToken ct = default)
        => await _context.StockTransfers.Include(s => s.Lines).FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<StockTransfer?> GetByTransferNumberAsync(string transferNumber, CancellationToken ct = default)
        => await _context.StockTransfers.FirstOrDefaultAsync(s => s.TransferNumber == transferNumber, ct);

    public async Task<IReadOnlyList<StockTransfer>> GetInTransitAsync(CancellationToken ct = default)
        => await _context.StockTransfers.Where(s => s.Status == StockTransferStatus.InTransit).ToListAsync(ct);

    public async Task<IReadOnlyList<StockTransfer>> GetByFromWarehouseAsync(Guid warehouseId, CancellationToken ct = default)
        => await _context.StockTransfers.Where(s => s.FromWarehouseId == warehouseId).ToListAsync(ct);

    public async Task<IReadOnlyList<StockTransfer>> GetByToWarehouseAsync(Guid warehouseId, CancellationToken ct = default)
        => await _context.StockTransfers.Where(s => s.ToWarehouseId == warehouseId).ToListAsync(ct);
}

public class StockMovementRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<StockMovement>(ctx, settings), IStockMovementRepository
{
    public async Task<IReadOnlyList<StockMovement>> GetByItemAsync(Guid itemId, CancellationToken ct = default)
        => await _context.StockMovements.Where(m => m.ItemId == itemId).OrderByDescending(m => m.CreatedAt).ToListAsync(ct);

    public async Task<IReadOnlyList<StockMovement>> GetByWarehouseAsync(Guid warehouseId, CancellationToken ct = default)
        => await _context.StockMovements.Where(m => m.WarehouseId == warehouseId).ToListAsync(ct);

    public async Task<IReadOnlyList<StockMovement>> GetByBatchAsync(Guid batchId, CancellationToken ct = default)
        => await _context.StockMovements.Where(m => m.BatchId == batchId).ToListAsync(ct);

    public async Task<IReadOnlyList<StockMovement>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken ct = default)
        => await _context.StockMovements.Where(m => m.CreatedAt >= from && m.CreatedAt <= to).ToListAsync(ct);

    public async Task<decimal> GetTotalMovementByItemAsync(Guid itemId, StockMovementType type, CancellationToken ct = default)
        => await _context.StockMovements.Where(m => m.ItemId == itemId && m.MovementType == type).SumAsync(m => m.Quantity, ct);
}

public class SupplierRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<Supplier>(ctx, settings), ISupplierRepository
{
    public async Task<Supplier?> GetBySupplierCodeAsync(string supplierCode, CancellationToken ct = default)
        => await _context.Suppliers.FirstOrDefaultAsync(s => s.SupplierCode == supplierCode, ct);

    public async Task<IReadOnlyList<Supplier>> GetActiveSuppliersAsync(CancellationToken ct = default)
        => await _context.Suppliers.Where(s => s.Status == SupplierStatus.Active).ToListAsync(ct);

    public async Task<IReadOnlyList<Supplier>> GetTopPerformersAsync(int count, CancellationToken ct = default)
        => await _context.Suppliers.OrderByDescending(s => s.Rating).Take(count).ToListAsync(ct);

    public async Task<IReadOnlyList<Supplier>> SearchAsync(string searchTerm, CancellationToken ct = default)
        => await _context.Suppliers.Where(s => s.Name.Contains(searchTerm)).ToListAsync(ct);
}

public class UserRepository(InventoryDbContext ctx, IOptions<DatabaseSettings> settings) : Repository<User>(ctx, settings), IUserRepository
{
    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => await _context.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

    public async Task<User?> GetByUserCodeAsync(string userCode, CancellationToken ct = default)
        => await _context.Users.FirstOrDefaultAsync(u => u.UserCode == userCode, ct);

    public async Task<IReadOnlyList<User>> GetActiveUsersAsync(CancellationToken ct = default)
        => await _context.Users.Where(u => u.Status == UserStatus.Active).ToListAsync(ct);

    public async Task<IReadOnlyList<User>> GetByRoleAsync(UserRole role, CancellationToken ct = default)
        => await _context.Users.Where(u => u.Role == role).ToListAsync(ct);
}
