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
public class WarehousesController : ControllerBase
{
    private readonly IRepository<Warehouse> _repo;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<WarehousesController> _logger;

    public WarehousesController(IRepository<Warehouse> repo, IUnitOfWork uow, ILogger<WarehousesController> logger)
    {
        _repo = repo;
        _uow = uow;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WarehouseDto>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WarehouseDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult<WarehouseDto>> Create([FromBody] CreateWarehouseRequest req, CancellationToken ct)
    {
        var entity = new Warehouse
        {
            WarehouseCode = req.WarehouseCode,
            Name = req.Name,
            Type = req.Type,
            Capacity = req.Capacity,
            Location = req.Location,
            ContactPerson = req.ContactPerson,
            ContactPhone = req.ContactPhone,
            IsActive = true,
        };
        await _repo.AddAsync(entity, ct);
        await _uow.CommitAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult<WarehouseDto>> Update(Guid id, [FromBody] UpdateWarehouseRequest req, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing == null) return NotFound();

        existing.Name = req.Name;
        existing.Type = req.Type;
        existing.Capacity = req.Capacity;
        existing.Location = req.Location;
        existing.ContactPerson = req.ContactPerson;
        existing.ContactPhone = req.ContactPhone;
        _repo.Update(existing);
        await _uow.CommitAsync(ct);
        return Ok(MapToDto(existing));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> SoftDelete(Guid id, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing == null) return NotFound();
        existing.IsActive = false;
        _repo.Update(existing);
        await _uow.CommitAsync(ct);
        return NoContent();
    }

    private static WarehouseDto MapToDto(Warehouse w) => new(
        w.Id, w.WarehouseCode, w.Name, w.Type, w.IsActive, w.Capacity, w.CreatedAt);
}
