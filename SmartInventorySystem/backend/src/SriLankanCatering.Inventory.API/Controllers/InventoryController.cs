using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.DTOs;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/items")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly IInventoryItemRepository _repo;
    private readonly ILogger<InventoryController> _logger;

    public InventoryController(IInventoryItemRepository repo, ILogger<InventoryController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InventoryItemDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(MapToDto(item));
    }

    [HttpGet("code/{code}")]
    public async Task<ActionResult<InventoryItemDto>> GetByCode(string code, CancellationToken ct)
    {
        var item = await _repo.GetByItemCodeAsync(code, ct);
        if (item == null) return NotFound(new { message = $"Item {code} not found" });
        return Ok(MapToDto(item));
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetLowStock(CancellationToken ct)
    {
        var items = await _repo.GetLowStockItemsAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("expiring")]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetExpiring([FromQuery] int days = 7, CancellationToken ct = default)
    {
        var items = await _repo.GetExpiringItemsAsync(days, ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,InventoryManager,StoreKeeper")]
    public async Task<ActionResult<InventoryItemDto>> Create([FromBody] CreateInventoryItemRequest req, CancellationToken ct)
    {
        var entity = new Domain.Entities.InventoryItem
        {
            ItemCode = req.ItemCode,
            Name = req.Name,
            CategoryId = req.CategoryId,
            PrimarySupplierId = req.PrimarySupplierId,
            ReorderLevel = req.ReorderLevel,
            ReorderQuantity = req.ReorderQuantity,
            UnitOfMeasure = req.UnitOfMeasure,
            StandardCost = req.StandardCost,
            CurrentPrice = new Money(req.CurrentPrice, "LKR"),
            StorageType = (StorageType)Enum.Parse(typeof(StorageType), req.StorageType),
            TemperatureZone = (TemperatureZone)Enum.Parse(typeof(TemperatureZone), req.TemperatureZone),
            ShelfLifeDays = req.ShelfLifeDays,
            IsPerishable = req.IsPerishable,
            IsBatchTracked = req.IsBatchTracked,
        };
        await _repo.AddAsync(entity, ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateInventoryItemRequest req, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing == null) return NotFound();
        existing.Name = req.Name;
        existing.Description = req.Description;
        existing.UpdatedAt = DateTime.UtcNow;
        _repo.Update(existing);
        return Ok(MapToDto(existing));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> SoftDelete(Guid id, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        await _repo.SoftDeleteAsync(id, userId, ct);
        return NoContent();
    }

    [HttpGet("search/semantic")]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> SemanticSearch([FromQuery] string q, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(q)) return BadRequest(new { message = "Query required" });
        var items = await _repo.SearchAsync(q, ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> Search([FromQuery] string q, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(q)) return BadRequest(new { message = "Search query is required" });
        var items = await _repo.SearchAsync(q, ct);
        return Ok(items.Select(MapToDto));
    }

    private static InventoryItemDto MapToDto(Domain.Entities.InventoryItem item) => new()
    {
        Id = item.Id,
        ItemCode = item.ItemCode,
        Name = item.Name,
        UnitOfMeasure = item.UnitOfMeasure,
        ReorderLevel = item.ReorderLevel,
        TotalQuantityOnHand = item.TotalQuantityOnHand,
        TotalQuantityAvailable = item.TotalQuantityAvailable,
        TotalInventoryValue = item.TotalInventoryValue.Amount,
        Status = item.Status.ToString(),
        StorageType = item.StorageType.ToString(),
        TemperatureZone = item.TemperatureZone.ToString(),
        IsPerishable = item.IsPerishable,
        IsActive = item.IsActive,
        AISummary = item.AISummary,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt,
    };

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        return Guid.Parse(claim?.Value ?? Guid.Empty.ToString());
    }
}
