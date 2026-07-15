
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly ILogger<AiController> _logger;

    public AiController(ILogger<AiController> logger)
    {
        _logger = logger;
    }

    [HttpPost("chat")]
    public async Task<ActionResult> Chat([FromBody] ChatRequest req, CancellationToken ct)
    {
        return Ok(new { message = "AI chat is processing: " + req.Message, suggestions = new[] { "Show low stock items", "Generate purchase order", "View expiry alerts" } });
    }

    [HttpGet("recommendations")]
    public async Task<ActionResult<IEnumerable<object>>> GetRecommendations(CancellationToken ct)
    {
        var recommendations = new[]
        {
            new { id = Guid.NewGuid(), title = "Low Stock Alert", insight = "5 items below reorder level", category = "Inventory", priority = "High", generatedAt = DateTime.UtcNow, confidenceScore = 0.92 },
            new { id = Guid.NewGuid(), title = "Expiry Warning", insight = "3 batches expiring within 7 days", category = "Quality", priority = "Critical", generatedAt = DateTime.UtcNow, confidenceScore = 0.98 }
        };
        return Ok(recommendations);
    }
}

public record ChatRequest(string Message);
