using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IGoodsReceivedNoteRepository _grn;
    private readonly IPurchaseOrderRepository _po;
    private readonly IGoodsIssueRepository _gi;
    private readonly IInventoryItemRepository _items;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(
        IGoodsReceivedNoteRepository grn, IPurchaseOrderRepository po,
        IGoodsIssueRepository gi, IInventoryItemRepository items,
        ILogger<ReportsController> logger)
    {
        _grn = grn;
        _po = po;
        _gi = gi;
        _items = items;
        _logger = logger;
    }

    [HttpGet("analytics")]
    [Authorize(Roles = "Administrator,FinanceOfficer,Auditor,InventoryManager")]
    public async Task<ActionResult> GetAnalytics([FromQuery] DateTime from, [FromQuery] DateTime to, CancellationToken ct)
    {
        var grns = await _grn.GetByDateRangeAsync(from, to, ct);
        var pos = await _po.GetAllAsync(ct);
        var gis = await _gi.GetByDateRangeAsync(from, to, ct);

        var totalReceived = grns.Sum(g => g.TotalValue.Amount);
        var totalIssued = gis.Count;
        var avgOrderValue = pos.Any() ? pos.Average(p => p.GrandTotal.Amount) : 0;

        return Ok(new
        {
            totalReceived,
            totalIssued,
            avgOrderValue,
            totalPurchaseOrders = pos.Count,
            totalGoodsReceived = grns.Count,
            reportGeneratedAt = DateTime.UtcNow,
            from,
            to
        });
    }

    [HttpGet("inventory-summary")]
    public async Task<ActionResult> GetInventorySummary(CancellationToken ct)
    {
        var items = await _items.GetAllAsync(ct);
        var lowStock = await _items.GetLowStockItemsAsync(ct);
        var expiring = await _items.GetExpiringItemsAsync(14, ct);
        var expired = await _items.GetExpiredItemsAsync(ct);

        return Ok(new
        {
            totalItems = items.Count,
            lowStockCount = lowStock.Count,
            expiringCount = expiring.Count,
            expiredCount = expired.Count,
            totalValue = items.Sum(i => i.TotalInventoryValue.Amount),
            generatedAt = DateTime.UtcNow
        });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll(CancellationToken ct)
    {
        return Ok(new[]
        {
            new { id = "analytics", name = "Inventory Analytics", description = "Full analytics dashboard", url = "/reports/analytics" },
            new { id = "inventory-summary", name = "Inventory Summary", description = "Stock levels summary", url = "/reports/inventory-summary" }
        });
    }
}
