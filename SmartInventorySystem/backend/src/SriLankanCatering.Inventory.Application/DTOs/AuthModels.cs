namespace SriLankanCatering.Inventory.Application.DTOs;

public class LoginRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public record AuthResponse(string Token, string RefreshToken, DateTime ExpiresAt, Guid UserId, string FullName, string Role);

public class RefreshTokenRequest
{
    public required string RefreshToken { get; set; }
}
