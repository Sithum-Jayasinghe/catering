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
public class GoodsIssuesController : ControllerBase
{
    private readonly IGoodsIssueRepository _repo;
    private readonly ILogger<GoodsIssuesController> _logger;

    public GoodsIssuesController(IGoodsIssueRepository repo, ILogger<GoodsIssuesController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Domain.Entities.GoodsIssue>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Domain.Entities.GoodsIssue>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetWithLinesAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,KitchenManager,StoreKeeper")]
    public async Task<ActionResult<Domain.Entities.GoodsIssue>> Create([FromBody] Domain.Entities.GoodsIssue entity, CancellationToken ct)
    {
        await _repo.AddAsync(entity, ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<Domain.Entities.GoodsIssue>>> GetPending(CancellationToken ct)
    {
        var items = await _repo.GetPendingApprovalAsync(ct);
        return Ok(items);
    }
}
