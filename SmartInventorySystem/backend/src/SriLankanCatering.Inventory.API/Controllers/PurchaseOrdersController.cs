using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.DTOs;
using SriLankanCatering.Inventory.Application.Abstractions;
using Microsoft.AspNetCore.Authorization;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PurchaseOrdersController : ControllerBase
{
    private readonly IPurchaseOrderRepository _repo;
    private readonly ILogger<PurchaseOrdersController> _logger;

    public PurchaseOrdersController(IPurchaseOrderRepository repo, ILogger<PurchaseOrdersController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PurchaseOrderDto>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PurchaseOrderDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetWithLinesAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,ProcurementOfficer")]
    public async Task<ActionResult<PurchaseOrderDto>> Create([FromBody] CreatePurchaseOrderRequest req, CancellationToken ct)
    {
        var entity = new Domain.Entities.PurchaseOrder
        {
            PONumber = $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid():N[..8]}",
            SupplierId = req.SupplierId,
            ShipToWarehouseId = req.ShipToWarehouseId,
            RequiredDate = req.RequiredDate,
            PaymentTerms = req.PaymentTerms,
        };
        await _repo.AddAsync(entity, ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult> Approve(Guid id, CancellationToken ct)
    {
        var existing = await _repo.GetWithLinesAsync(id, ct);
        if (existing == null) return NotFound();
        existing.Status = Domain.Enums.PurchaseOrderStatus.Approved;
        existing.ApprovedBy = GetCurrentUserId();
        existing.ApprovedAt = DateTime.UtcNow;
        return Ok(MapToDto(existing));
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Administrator,ProcurementOfficer,InventoryManager")]
    public async Task<ActionResult<IEnumerable<PurchaseOrderDto>>> GetPending(CancellationToken ct)
    {
        var items = await _repo.GetPendingApprovalAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    private static PurchaseOrderDto MapToDto(Domain.Entities.PurchaseOrder po) => new()
    {
        Id = po.Id,
        PONumber = po.PONumber,
        SupplierId = po.SupplierId,
        Status = po.Status.ToString(),
        TotalAmount = po.GrandTotal.Amount,
        CreatedAt = po.CreatedAt,
    };

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        return Guid.Parse(claim?.Value ?? Guid.Empty.ToString());
    }
}
