using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Application.DTOs;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrator")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _repo;
    private readonly IUnitOfWork _uow;

    public UsersController(IUserRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(MapToDto(item));
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserRequest req, CancellationToken ct)
    {
        var existing = await _repo.GetByEmailAsync(req.Email, ct);
        if (existing != null) return Conflict(new { message = "Email already in use" });

        var entity = new User
        {
            FullName = req.FullName,
            Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = Enum.Parse<UserRole>(req.Role),
            Department = req.Department,
            WarehouseId = req.WarehouseId,
            Status = UserStatus.Active,
            UserCode = $"USR-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}",
        };
        await _repo.AddAsync(entity, ct);
        await _uow.CommitAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> Update(Guid id, [FromBody] UpdateUserRequest req, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing == null) return NotFound();

        existing.FullName = req.FullName;
        existing.Department = req.Department;
        existing.Role = Enum.Parse<UserRole>(req.Role);
        existing.WarehouseId = req.WarehouseId;
        _repo.Update(existing);
        await _uow.CommitAsync(ct);
        return Ok(MapToDto(existing));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> SoftDelete(Guid id, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing == null) return NotFound();
        existing.Status = UserStatus.Inactive;
        existing.IsActive = false;
        _repo.Update(existing);
        await _uow.CommitAsync(ct);
        return NoContent();
    }

    private static UserDto MapToDto(User u) => new(
        u.Id, u.UserCode, u.FullName, u.Email,
        u.Role.ToString(), u.Status.ToString(),
        u.Department, u.CreatedAt);
}
