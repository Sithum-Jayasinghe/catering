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
public class WarehousesController : ControllerBase
{
    private readonly IRepository<Warehouse> _repo;
    private readonly ILogger<WarehousesController> _logger;

    public WarehousesController(IRepository<Warehouse> repo, ILogger<WarehousesController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Warehouse>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Warehouse>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult<Warehouse>> Create([FromBody] Warehouse entity, CancellationToken ct)
    {
        await _repo.AddAsync(entity, ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }
}
