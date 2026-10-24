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
public class CategoriesController : ControllerBase
{
    private readonly IRepository<Category> _repo;
    private readonly IUnitOfWork _uow;

    public CategoriesController(IRepository<Category> repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(c => new { c.Id, c.Name, c.Description, c.ParentCategoryId, c.IsActive, c.CreatedAt }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(new { item.Id, item.Name, item.Description, item.ParentCategoryId, item.IsActive, item.CreatedAt });
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult> Create([FromBody] CreateCategoryRequest req, CancellationToken ct)
    {
        var entity = new Category
        {
            Name = req.Name,
            Description = req.Description,
            ParentCategoryId = req.ParentCategoryId,
            IsActive = true,
        };
        await _repo.AddAsync(entity, ct);
        await _uow.CommitAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, new { entity.Id, entity.Name, entity.Description, entity.ParentCategoryId, entity.IsActive, entity.CreatedAt });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateCategoryRequest req, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing == null) return NotFound();
        existing.Name = req.Name;
        existing.Description = req.Description;
        existing.ParentCategoryId = req.ParentCategoryId;
        _repo.Update(existing);
        await _uow.CommitAsync(ct);
        return Ok(new { existing.Id, existing.Name, existing.Description, existing.ParentCategoryId, existing.IsActive, existing.CreatedAt });
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
}
