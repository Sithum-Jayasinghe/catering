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
    public async Task<ActionResult<IEnumerable<AiInsightDto>>> GetInsights([FromServices] IHttpClientFactory httpClientFactory, CancellationToken ct)
    {
        try
        {
            var client = httpClientFactory.CreateClient("AiService");
            var payload = new { prompt = "Generate dashboard insights", context = new { userId = "system" } };
            var json = System.Text.Json.JsonSerializer.Serialize(payload);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/api/ai/agents/run-all", content, ct);

            if (response.IsSuccessStatusCode)
            {
                var resultJson = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>(ct);
                var results = resultJson.TryGetProperty("results", out var r) ? r.EnumerateArray() : default;
                var aiInsights = new List<AiInsightDto>();
                foreach (var item in results)
                {
                    bool success = item.TryGetProperty("success", out var s) && s.GetBoolean();
                    if (!success) continue;
                    string agentName = item.TryGetProperty("agentName", out var an) ? an.GetString() ?? "AI" : "AI";
                    string insight = item.TryGetProperty("insight", out var ins) ? ins.GetString() ?? string.Empty : string.Empty;
                    double confidence = item.TryGetProperty("confidence", out var c2) ? c2.GetDouble() : 0.8;
                    aiInsights.Add(new AiInsightDto { Title = agentName, Insight = insight, Category = agentName, Priority = confidence > 0.9 ? "High" : "Medium", GeneratedAt = DateTime.UtcNow, SourceAgent = agentName, ConfidenceScore = confidence, IsActionable = true });
                }
                if (aiInsights.Count > 0) return Ok(aiInsights);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "AI service unavailable for dashboard insights");
        }

        // Fallback — compute from real data
        var lowStockFallback = await _items.GetLowStockItemsAsync(ct);
        var expiringFallback = await _items.GetExpiringItemsAsync(7, ct);
        var fallbackInsights = new List<AiInsightDto>();
        if (lowStockFallback.Count > 0) fallbackInsights.Add(new() { Title = "Low Stock Alert", Insight = $"{lowStockFallback.Count} items at or below reorder level", Category = "Inventory", Priority = "High", GeneratedAt = DateTime.UtcNow, SourceAgent = "InventoryAgent", ConfidenceScore = 0.95, IsActionable = true });
        if (expiringFallback.Count > 0) fallbackInsights.Add(new() { Title = "Expiry Warning", Insight = $"{expiringFallback.Count} items have batches expiring within 7 days", Category = "Quality", Priority = "Critical", GeneratedAt = DateTime.UtcNow, SourceAgent = "ExpiryAgent", ConfidenceScore = 0.98, IsActionable = true });
        return Ok(fallbackInsights);
    }

    private Guid GetCurrentUserId() => Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
}
