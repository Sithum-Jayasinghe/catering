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
public class SuppliersController : ControllerBase
{
    private readonly ISupplierRepository _repo;
    private readonly ILogger<SuppliersController> _logger;

    public SuppliersController(ISupplierRepository repo, ILogger<SuppliersController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Supplier>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items);
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<Supplier>>> GetActive(CancellationToken ct)
    {
        var items = await _repo.GetActiveSuppliersAsync(ct);
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Supplier>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,ProcurementOfficer")]
    public async Task<ActionResult<Supplier>> Create([FromBody] Supplier entity, CancellationToken ct)
    {
        await _repo.AddAsync(entity, ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpGet("top-performers")]
    public async Task<ActionResult<IEnumerable<Supplier>>> GetTopPerformers([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var items = await _repo.GetTopPerformersAsync(count, ct);
        return Ok(items);
    }
}
