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
public class NotificationsController : ControllerBase
{
    private readonly INotificationRepository _repo;
    private readonly IUnitOfWork _uow;

    public NotificationsController(INotificationRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("unread")]
    public async Task<ActionResult<IEnumerable<object>>> GetUnread(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        var items = await _repo.GetUnreadByUserIdAsync(userId, ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpPatch("{id}/read")]
    public async Task<ActionResult> MarkAsRead(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        if (item == null) return NotFound();
        item.IsRead = true;
        item.ReadAt = DateTime.UtcNow;
        _repo.Update(item);
        await _uow.CommitAsync(ct);
        return Ok(MapToDto(item));
    }

    [HttpPatch("read-all")]
    public async Task<ActionResult> MarkAllAsRead(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        var items = await _repo.GetUnreadByUserIdAsync(userId, ct);
        foreach (var item in items)
        {
            item.IsRead = true;
            item.ReadAt = DateTime.UtcNow;
            _repo.Update(item);
        }
        await _uow.CommitAsync(ct);
        return Ok(new { marked = items.Count });
    }

    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> Create([FromBody] CreateNotificationRequest req, CancellationToken ct)
    {
        var entity = new Notification
        {
            Title = req.Title,
            Message = req.Message,
            Type = req.Type,
            UserId = req.UserId ?? GetCurrentUserId(),
            IsRead = false,
        };
        await _repo.AddAsync(entity, ct);
        await _uow.CommitAsync(ct);
        return CreatedAtAction(nameof(GetAll), null, MapToDto(entity));
    }

    private static object MapToDto(Notification n) => new
    {
        n.Id, n.Title, n.Message, n.Type, n.IsRead, n.ReadAt, n.UserId, n.CreatedAt
    };

    private Guid GetCurrentUserId() =>
        Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
}
