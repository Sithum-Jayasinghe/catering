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
public class StockTransfersController : ControllerBase
{
    private readonly IStockTransferRepository _repo;
    private readonly ILogger<StockTransfersController> _logger;

    public StockTransfersController(IStockTransferRepository repo, ILogger<StockTransfersController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StockTransfer>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StockTransfer>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetWithLinesAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,InventoryManager,StoreKeeper")]
    public async Task<ActionResult<StockTransfer>> Create([FromBody] StockTransfer entity, CancellationToken ct)
    {
        await _repo.AddAsync(entity, ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }
}
