using Microsoft.AspNetCore.Mvc;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("")]
public class HealthController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });
    }

    [HttpGet("")]
    public IActionResult Root()
    {
        return Ok(new
        {
            name = "Smart Inventory Management API",
            version = "v1",
            status = "running",
            swagger = "/swagger"
        });
    }
}
