using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Application.DTOs;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Common;
using Microsoft.AspNetCore.Authorization;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SuppliersController : ControllerBase
{
    private readonly ISupplierRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<SuppliersController> _logger;

    public SuppliersController(ISupplierRepository repo, IUnitOfWork uow, ILogger<SuppliersController> logger)
    {
        _repo = repo;
        _uow = uow;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SupplierDto>>> GetAll(CancellationToken ct)
    {
        var items = await _repo.GetAllAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<SupplierDto>>> GetActive(CancellationToken ct)
    {
        var items = await _repo.GetActiveSuppliersAsync(ct);
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SupplierDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _repo.GetByIdAsync(id, ct);
        if (item == null) return NotFound();
        return Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,ProcurementOfficer")]
    public async Task<ActionResult<SupplierDto>> Create([FromBody] CreateSupplierRequest req, CancellationToken ct)
    {
        var entity = new Supplier
        {
            SupplierCode = req.SupplierCode,
            Name = req.Name,
            RegistrationNumber = $"REG-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
            ContactPerson = req.ContactPerson,
            ContactEmail = req.ContactEmail,
            ContactPhone = req.ContactPhone,
            ContactFax = string.Empty,
            Website = req.Website,
            Address = new Address
            {
                StreetAddress = req.StreetAddress ?? string.Empty,
                City = req.City ?? string.Empty,
                Province = req.Province ?? string.Empty,
                PostalCode = req.PostalCode ?? string.Empty,
                Country = req.Country ?? "Sri Lanka",
            },
            PaymentTerms = req.PaymentTerms,
            AverageLeadTimeDays = req.LeadTimeDays,
            Notes = req.Notes,
            Status = SupplierStatus.Active,
        };
        await _repo.AddAsync(entity, ct);
        await _uow.CommitAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator,ProcurementOfficer")]
    public async Task<ActionResult<SupplierDto>> Update(Guid id, [FromBody] UpdateSupplierRequest req, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing == null) return NotFound();

        existing.Name = req.Name;
        existing.ContactPerson = req.ContactPerson;
        existing.ContactEmail = req.ContactEmail;
        existing.ContactPhone = req.ContactPhone;
        existing.Website = req.Website;
        existing.PaymentTerms = req.PaymentTerms;
        existing.AverageLeadTimeDays = req.LeadTimeDays;
        existing.Notes = req.Notes;
        if (req.StreetAddress != null)
        {
            existing.Address = new Address
            {
                StreetAddress = req.StreetAddress,
                City = req.City ?? string.Empty,
                Province = req.Province ?? string.Empty,
                PostalCode = req.PostalCode ?? string.Empty,
                Country = req.Country ?? "Sri Lanka",
            };
        }
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
        existing.Status = SupplierStatus.Inactive;
        _repo.Update(existing);
        await _uow.CommitAsync(ct);
        return NoContent();
    }

    [HttpGet("top-performers")]
    public async Task<ActionResult<IEnumerable<SupplierDto>>> GetTopPerformers([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var items = await _repo.GetTopPerformersAsync(count, ct);
        return Ok(items.Select(MapToDto));
    }

    private static SupplierDto MapToDto(Supplier s) => new(
        s.Id, s.SupplierCode, s.Name, s.ContactPerson,
        s.ContactEmail, s.Rating, s.Status.ToString(), s.CreatedAt);
}
