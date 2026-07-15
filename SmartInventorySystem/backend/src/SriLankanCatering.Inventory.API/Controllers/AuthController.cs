using Microsoft.AspNetCore.Mvc;
using SriLankanCatering.Inventory.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using SriLankanCatering.Inventory.Infrastructure.Services;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]

public class AuthController : ControllerBase
{
    private readonly AuthService _auth;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService auth, ILogger<AuthController> logger)
    {
        _auth = auth;
        _logger = logger;
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult> GetProfile(CancellationToken ct)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var name = User.Identity?.Name;
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        return Ok(new { userId, email, fullName = name, role });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        var result = await _auth.AuthenticateAsync(req.Email, req.Password, ct);
        if (!result.IsSuccess) return Unauthorized(new { message = result.Error });
        return Ok(result.Data);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshTokenRequest req, CancellationToken ct)
    {
        var result = await _auth.RefreshTokenAsync(req.RefreshToken, ct);
        if (!result.IsSuccess) return Unauthorized(new { message = result.Error });
        return Ok(result.Data);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout(CancellationToken ct)
    {
        var user = User.Identity?.Name;
        await _auth.RevokeRefreshTokenAsync(user ?? string.Empty, ct);
        return Ok(new { message = "Logged out successfully" });
    }
}
