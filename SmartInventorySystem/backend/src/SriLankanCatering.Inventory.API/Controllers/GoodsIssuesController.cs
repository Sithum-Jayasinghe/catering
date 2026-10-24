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
public class GoodsIssuesController : ControllerBase
{
    private readonly IGoodsIssueRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<GoodsIssuesController> _logger;

    public GoodsIssuesController(IGoodsIssueRepository repo, IUnitOfWork uow, ILogger<GoodsIssuesController> logger)
    {
        _repo = repo;
        _uow = uow;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GoodsIssueDto>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GoodsIssueDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetWithLinesAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,KitchenManager,StoreKeeper")]
    public async Task<ActionResult<GoodsIssueDto>> Create([FromBody] CreateGoodsIssueRequest req, CancellationToken ct)
    {
        var entity = new GoodsIssue
        {
            IssueNumber = $"GI-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}",
            WarehouseId = req.WarehouseId,
            RequiredDate = req.RequiredDate,
            Department = req.Department,
            Purpose = req.Purpose,
            Notes = req.Notes,
            RequestedBy = GetCurrentUserId(),
            Status = Domain.Enums.GoodsIssueStatus.PendingApproval,
        };

        foreach (var line in req.Lines)
        {
            entity.Lines.Add(new GoodsIssueLine
            {
                GoodsIssueId = entity.Id,
                ItemId = line.ItemId,
                RequestedQuantity = line.Quantity,
                Notes = line.Notes,
            });
        }

        await _repo.AddAsync(entity, ct);
        await _uow.CommitAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<GoodsIssueDto>>> GetPending(CancellationToken ct)
    {
        var items = await _repo.GetPendingApprovalAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    private static GoodsIssueDto MapToDto(GoodsIssue g) => new(
        g.Id, g.IssueNumber, g.WarehouseId,
        g.Status.ToString(), g.RequiredDate, g.RequestedBy, g.CreatedAt);

    private Guid GetCurrentUserId() =>
        Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
}
