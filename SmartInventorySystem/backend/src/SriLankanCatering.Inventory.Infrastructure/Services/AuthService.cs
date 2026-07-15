using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Application.DTOs;
using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;
using SriLankanCatering.Inventory.Domain.Exceptions;
using SriLankanCatering.Inventory.Infrastructure.Configurations;
using SriLankanCatering.Inventory.Infrastructure.Persistence;

namespace SriLankanCatering.Inventory.Infrastructure.Services;

public class AuthService
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _uow;
    private readonly JwtSettings _jwt;
    private readonly ILogger<AuthService> _logger;
    private readonly InventoryDbContext _db;

    public AuthService(IUserRepository users, IUnitOfWork uow, IOptions<JwtSettings> jwt, ILogger<AuthService> logger, InventoryDbContext db)
    {
        _users = users;
        _uow = uow;
        _jwt = jwt.Value;
        _logger = logger;
        _db = db;
    }

    public async Task<Result<AuthResponse>> AuthenticateAsync(string email, string password, CancellationToken ct)
    {
        var user = await _users.GetByEmailAsync(email, ct);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return Result<AuthResponse>.Failure("Invalid email or password");

        if (user.Status != UserStatus.Active)
            return Result<AuthResponse>.Failure("Account is not active");

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        user.LastLoginAt = DateTime.UtcNow;
        _users.Update(user);
        await _uow.CommitAsync(ct);
        return Result<AuthResponse>.Success(new AuthResponse(token, refreshToken, DateTime.UtcNow.AddHours(1), user.Id, user.FullName, user.Role.ToString()));
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(string refreshToken, CancellationToken ct)
    {
        var users = await _users.GetAllAsync(ct);
        var user = users.FirstOrDefault(u => u.RefreshToken == refreshToken && u.RefreshTokenExpiry > DateTime.UtcNow);
        if (user == null) return Result<AuthResponse>.Failure("Invalid or expired refresh token");
        var token = GenerateJwtToken(user);
        user.RefreshToken = GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        _users.Update(user);
        await _uow.CommitAsync(ct);
        return Result<AuthResponse>.Success(new AuthResponse(token, user.RefreshToken!, DateTime.UtcNow.AddHours(1), user.Id, user.FullName, user.Role.ToString()));
    }

    public async Task RevokeRefreshTokenAsync(string email, CancellationToken ct)
    {
        var user = await _users.GetByEmailAsync(email, ct);
        if (user == null) return;
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        _users.Update(user);
        await _uow.CommitAsync(ct);
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer, audience: _jwt.Audience, claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwt.AccessTokenExpiryMinutes), signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken() => Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
}
