using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using SriLankanCatering.Inventory.API.Middleware;

namespace SriLankanCatering.Inventory.API.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<ErrorHandlingMiddleware>();
        app.UseMiddleware<RequestLoggingMiddleware>();
        return app;
    }
}
