using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Application.DTOs;
using SriLankanCatering.Inventory.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StockTransfersController : ControllerBase
{
    private readonly IStockTransferRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<StockTransfersController> _logger;

    public StockTransfersController(IStockTransferRepository repo, IUnitOfWork uow, ILogger<StockTransfersController> logger)
    {
        _repo = repo;
        _uow = uow;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StockTransferDto>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StockTransferDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetWithLinesAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,InventoryManager,StoreKeeper")]
    public async Task<ActionResult<StockTransferDto>> Create([FromBody] CreateStockTransferRequest req, CancellationToken ct)
    {
        var entity = new StockTransfer
        {
            TransferNumber = $"ST-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}",
            FromWarehouseId = req.FromWarehouseId,
            ToWarehouseId = req.ToWarehouseId,
            TransferReason = req.TransferReason,
            Notes = req.Notes,
            RequestedBy = GetCurrentUserId(),
            Status = Domain.Enums.StockTransferStatus.PendingApproval,
        };

        foreach (var line in req.Lines)
        {
            entity.Lines.Add(new StockTransferLine
            {
                StockTransferId = entity.Id,
                ItemId = line.ItemId,
                Quantity = line.Quantity,
                Notes = line.Notes,
            });
        }

        await _repo.AddAsync(entity, ct);
        await _uow.CommitAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult> Approve(Guid id, CancellationToken ct)
    {
        var existing = await _repo.GetWithLinesAsync(id, ct);
        if (existing == null) return NotFound();
        existing.Status = Domain.Enums.StockTransferStatus.Approved;
        existing.ApprovedBy = GetCurrentUserId();
        existing.ApprovedAt = DateTime.UtcNow;
        _repo.Update(existing);
        await _uow.CommitAsync(ct);
        return Ok(MapToDto(existing));
    }

    private static StockTransferDto MapToDto(StockTransfer st) => new(
        st.Id, st.TransferNumber, st.FromWarehouseId,
        st.ToWarehouseId, st.Status.ToString(), st.CreatedAt);

    private Guid GetCurrentUserId() =>
        Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
}
