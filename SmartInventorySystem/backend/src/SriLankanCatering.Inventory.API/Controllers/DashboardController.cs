using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.DTOs;
using SriLankanCatering.Inventory.Application.Abstractions;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IInventoryItemRepository _items;
    private readonly IGoodsReceivedNoteRepository _grn;
    private readonly IPurchaseOrderRepository _po;
    private readonly INotificationRepository _notifications;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(
        IInventoryItemRepository items, IGoodsReceivedNoteRepository grn,
        IPurchaseOrderRepository po, INotificationRepository notifications,
        ILogger<DashboardController> logger)
    {
        _items = items;
        _grn = grn;
        _po = po;
        _notifications = notifications;
        _logger = logger;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        var lowStock = await _items.GetLowStockItemsAsync(ct);
        var expiring = await _items.GetExpiringItemsAsync(14, ct);
        var pendingPurchases = await _po.GetByStatusAsync(PurchaseOrderStatus.PendingApproval, ct);
        var unreadNotifications = await _notifications.GetUnreadByUserIdAsync(userId, ct);

        var dto = new DashboardStatsDto
        {
            TotalInventoryItems = await _items.CountAsync(cancellationToken: ct),
            TotalWarehouses = 0,
            LowStockItems = lowStock.Count,
            ExpiringItemsThisWeek = expiring.Count,
            PendingPurchaseOrders = pendingPurchases.Count,
            UnreadNotifications = unreadNotifications.Count,
            LowStockItemsList = lowStock.Select(i => new LowStockItemDto
            {
                Id = i.Id, ItemCode = i.ItemCode, Name = i.Name,
                CategoryName = i.Category?.Name ?? string.Empty,
                QuantityOnHand = i.TotalQuantityOnHand, ReorderLevel = i.ReorderLevel,
                RecommendedReorderQuantity = i.ReorderQuantity, UnitOfMeasure = i.UnitOfMeasure, Status = i.Status.ToString()
            }).ToList(),
            ExpiringItemsList = expiring.Select(i => new ExpiringItemDto
            {
                Id = i.Id, ItemCode = i.ItemCode, Name = i.Name,
                DaysUntilExpiry = (int)(DateTime.UtcNow - i.Batches.Max(b => b.ExpiryDate)).TotalDays
            }).ToList(),
        };
        return Ok(dto);
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<IEnumerable<LowStockItemDto>>> GetLowStock(CancellationToken ct)
    {
        var items = await _items.GetLowStockItemsAsync(ct);
        return Ok(items.Select(i => new LowStockItemDto
        {
            Id = i.Id, ItemCode = i.ItemCode, Name = i.Name,
            CategoryName = i.Category?.Name ?? string.Empty,
            QuantityOnHand = i.TotalQuantityOnHand, ReorderLevel = i.ReorderLevel,
            RecommendedReorderQuantity = i.ReorderQuantity, UnitOfMeasure = i.UnitOfMeasure, Status = i.Status.ToString()
        }));
    }

    [HttpGet("expiry-alerts")]
    public async Task<ActionResult<IEnumerable<ExpiringItemDto>>> GetExpiryAlerts(CancellationToken ct)
    {
        var items = await _items.GetExpiringItemsAsync(14, ct);
        return Ok(items.SelectMany(i => i.Batches.Where(b => b.RemainingQuantity > 0 && b.ExpiryDate <= DateTime.UtcNow.AddDays(14)).Select(b => new ExpiringItemDto
        {
            Id = i.Id, ItemCode = i.ItemCode, Name = i.Name,
            BatchId = b.Id, BatchNumber = b.BatchNumber, ExpiryDate = b.ExpiryDate,
            RemainingQuantity = b.RemainingQuantity, UnitOfMeasure = b.UnitOfMeasure,
            DaysUntilExpiry = (int)(b.ExpiryDate - DateTime.UtcNow).TotalDays
        })));
    }

    [HttpGet("insights")]
    public async Task<ActionResult<IEnumerable<AiInsightDto>>> GetInsights(CancellationToken ct)
    {
        return Ok(new List<AiInsightDto>
        {
            new() { Title = "Low Stock Alert", Insight = "5 items below reorder level", Category = "Inventory", Priority = "High", GeneratedAt = DateTime.UtcNow, SourceAgent = "InventoryAgent", ConfidenceScore = 0.92, IsActionable = true },
            new() { Title = "Expiry Warning", Insight = "3 batches expiring within 7 days", Category = "Quality", Priority = "Critical", GeneratedAt = DateTime.UtcNow, SourceAgent = "ExpiryAgent", ConfidenceScore = 0.98, IsActionable = true },
            new() { Title = "Supplier Delay Risk", Insight = "Supplier X had 20% late delivery rate", Category = "Procurement", Priority = "Medium", GeneratedAt = DateTime.UtcNow, SourceAgent = "SupplierAgent", ConfidenceScore = 0.85, IsActionable = true },
        });
    }

    private Guid GetCurrentUserId() => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
}
