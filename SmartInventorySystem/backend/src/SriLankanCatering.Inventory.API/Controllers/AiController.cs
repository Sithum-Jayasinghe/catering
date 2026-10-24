using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SriLankanCatering.Inventory.Application.DTOs;
using System.Text;
using System.Text.Json;

namespace SriLankanCatering.Inventory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AiController> _logger;

    public AiController(IHttpClientFactory httpClientFactory, ILogger<AiController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpPost("chat")]
    public async Task<ActionResult> Chat([FromBody] AiChatRequest req, CancellationToken ct)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("AiService");
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "guest";

            var payload = new
            {
                message = req.Message,
                conversationId = req.ConversationId,
                userId,
                agentType = req.AgentType
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/api/ai/chat", content, ct);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync(ct);
                return Content(result, "application/json");
            }

            _logger.LogWarning("AI service returned {StatusCode}", response.StatusCode);
            // Fallback to basic response
            return Ok(new
            {
                message = $"AI service is temporarily unavailable. Your query: \"{req.Message}\" has been noted.",
                suggestions = new[] { "Show low stock items", "Generate purchase order", "View expiry alerts" },
                metadata = new { agent = "fallback", confidence = 0.0 }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to reach AI service");
            return Ok(new
            {
                message = $"AI service is offline. Your query: \"{req.Message}\" — please try again later.",
                suggestions = new[] { "Show low stock items", "View inventory", "Check expiry alerts" },
                metadata = new { agent = "fallback", confidence = 0.0 }
            });
        }
    }

    [HttpGet("recommendations")]
    public async Task<ActionResult> GetRecommendations(CancellationToken ct)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("AiService");
            var payload = new { prompt = "Generate recommendations", context = new { userId = "system" } };
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/api/ai/agents/run-all", content, ct);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync(ct);
                return Content(result, "application/json");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get AI recommendations");
        }

        // Fallback
        return Ok(new { total = 0, passed = 0, failed = 0, results = Array.Empty<object>() });
    }

    [HttpGet("agents")]
    public async Task<ActionResult> ListAgents(CancellationToken ct)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("AiService");
            var response = await client.GetAsync("/api/ai/agents", ct);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync(ct);
                return Content(result, "application/json");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to list AI agents");
        }

        return Ok(new { agents = Array.Empty<string>() });
    }

    [HttpPost("agents/run")]
    [Authorize(Roles = "Administrator,InventoryManager")]
    public async Task<ActionResult> RunAgent([FromBody] RunAgentRequest req, CancellationToken ct)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("AiService");
            var json = JsonSerializer.Serialize(new { agentType = req.AgentType, prompt = req.Prompt, context = req.Context });
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/api/ai/agents/run", content, ct);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync(ct);
                return Content(result, "application/json");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to run AI agent {AgentType}", req.AgentType);
        }

        return Ok(new { agentName = req.AgentType, success = false, insight = "AI service unavailable" });
    }

    [HttpGet("llm/status")]
    public async Task<ActionResult> GetLlmStatus(CancellationToken ct)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("AiService");
            var response = await client.GetAsync("/api/ai/llm/status", ct);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync(ct);
                return Content(result, "application/json");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get LLM status");
        }

        return Ok(new
        {
            provider = "ollama",
            available = false,
            model = "llama3.2",
            message = "AI service is not reachable. Ensure the AI service and Ollama are running."
        });
    }

    [HttpPost("llm/chat")]
    public async Task<ActionResult> DirectLlmChat([FromBody] AiChatRequest req, CancellationToken ct)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("AiService");
            var payload = new { message = req.Message, systemPrompt = (string?)null };
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/api/ai/llm/chat", content, ct);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync(ct);
                return Content(result, "application/json");
            }

            _logger.LogWarning("Direct LLM chat returned {StatusCode}", response.StatusCode);
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            return StatusCode((int)response.StatusCode, errorBody);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to reach LLM for direct chat");
            return Ok(new
            {
                message = "LLM is unavailable. Ensure Ollama is running: ollama serve && ollama pull llama3.2",
                model = "llama3.2",
                provider = "ollama-local"
            });
        }
    }
}

public class RunAgentRequest
{
    public string AgentType { get; set; } = string.Empty;
    public string Prompt { get; set; } = "Run analysis";
    public Dictionary<string, object>? Context { get; set; }
}
