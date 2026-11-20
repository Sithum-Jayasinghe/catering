using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.DTOs;
using SriLankanCatering.Inventory.Application.Abstractions;
using Microsoft.AspNetCore.Authorization;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GoodsReceivedController : ControllerBase
{
    private readonly IGoodsReceivedNoteRepository _repo;
    private readonly ILogger<GoodsReceivedController> _logger;

    public GoodsReceivedController(IGoodsReceivedNoteRepository repo, ILogger<GoodsReceivedController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GoodsReceivedNoteDto>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GoodsReceivedNoteDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetWithLinesAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,StoreKeeper,InventoryManager")]
    public async Task<ActionResult<GoodsReceivedNoteDto>> Create([FromBody] CreateGoodsReceivedNoteRequest req, CancellationToken ct)
    {
        var entity = new Domain.Entities.GoodsReceivedNote
        {
            GrnNumber = $"GRN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
            PurchaseOrderId = req.PurchaseOrderId,
            SupplierId = req.SupplierId,
            ReceivedBy = GetCurrentUserId(),
            WarehouseId = req.WarehouseId,
            StorageLocationId = req.StorageLocationId,
            DeliveryDate = req.DeliveryDate,
            ReceivedDate = DateTime.UtcNow,
        };
        await _repo.AddAsync(entity, ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Administrator,InventoryManager,Auditor")]
    public async Task<ActionResult<IEnumerable<GoodsReceivedNoteDto>>> GetPending(CancellationToken ct)
    {
        var items = await _repo.GetPendingVerificationAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    private static GoodsReceivedNoteDto MapToDto(Domain.Entities.GoodsReceivedNote note) => new()
    {
        Id = note.Id,
        GrnNumber = note.GrnNumber,
        PurchaseOrderId = note.PurchaseOrderId,
        SupplierId = note.SupplierId,
        Status = note.Status.ToString(),
        TotalValue = note.TotalValue.Amount,
        ReceivedDate = note.ReceivedDate,
        CreatedAt = note.CreatedAt,
    };

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        return Guid.Parse(claim?.Value ?? Guid.Empty.ToString());
    }
}
