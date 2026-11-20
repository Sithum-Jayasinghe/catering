using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Infrastructure;
using SriLankanCatering.Inventory.Infrastructure.Configurations;
using SriLankanCatering.Inventory.Infrastructure.Persistence;
using SriLankanCatering.Inventory.Infrastructure.Repositories;
using SriLankanCatering.Inventory.Infrastructure.Services;
using SriLankanCatering.Inventory.API.Middleware;
using System.Threading.RateLimiting;

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();
builder.Configuration.AddEnvironmentVariables();
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true);

// Supabase / PostgreSQL connection string – set DATABASE_URL env var on Render
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration["Database:ConnectionString"]
    ?? throw new InvalidOperationException("No database connection string found.");

builder.Services.AddDbContext<InventoryDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql =>
    {
        npgsql.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(10), null);
    }));

builder.Services.AddMemoryCache();

// Use Redis only when a real Redis URL is configured; fall back to in-memory otherwise
var redisConnection = builder.Configuration.GetValue<string>("Redis:ConnectionString")
    ?? Environment.GetEnvironmentVariable("REDIS_URL");
if (!string.IsNullOrWhiteSpace(redisConnection) && !redisConnection.StartsWith("localhost"))
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = redisConnection;
        options.InstanceName = builder.Configuration.GetValue<string>("Redis:InstanceName") ?? "InventoryCache:";
    });
}
else
{
    builder.Services.AddDistributedMemoryCache();
}

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Smart Inventory Management API",
        Version = "v1",
        Description = "Enterprise AI-Powered Smart Inventory Management System for SriLankan Catering"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization", Type = SecuritySchemeType.Http,
        Scheme = "bearer", BearerFormat = "JWT", In = ParameterLocation.Header
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, Array.Empty<string>() }
    });
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<SriLankanCatering.Inventory.Infrastructure.Configurations.DatabaseSettings>(builder.Configuration.GetSection("Database"));
builder.Services.Configure<SriLankanCatering.Inventory.Infrastructure.Configurations.RedisSettings>(builder.Configuration.GetSection("Redis"));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IInventoryItemRepository, InventoryItemRepository>();
builder.Services.AddScoped<IGoodsReceivedNoteRepository, GoodsReceivedNoteRepository>();
builder.Services.AddScoped<IGoodsIssueRepository, GoodsIssueRepository>();
builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
builder.Services.AddScoped<IStockTransferRepository, StockTransferRepository>();
builder.Services.AddScoped<IStockMovementRepository, StockMovementRepository>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<ICacheService, MemoryCacheService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<DateTimeProvider>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient("AiService", client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration.GetValue<string>("AiService:BaseUrl")
        ?? Environment.GetEnvironmentVariable("AI_SERVICE_URL")
        ?? "http://localhost:8001");
    client.Timeout = TimeSpan.FromSeconds(30);
});

// CORS – AllowedOrigins env var is set on Render/Vercel; comma-separated list
var rawOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")
    ?? builder.Configuration.GetValue<string>("AllowedOrigins")
    ?? "http://localhost:3000,http://localhost:5173";
var allowedOrigins = rawOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var partitionKey = context.User.Identity?.Name ?? context.Request.Headers.Host.ToString();
        return RateLimitPartition.GetFixedWindowLimiter(partitionKey,
            _ => new FixedWindowRateLimiterOptions { PermitLimit = 100, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 });
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    var jwt = builder.Configuration.GetSection("Jwt").Get<JwtSettings>() ?? new JwtSettings();
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt.Issuer,
        ValidAudience = jwt.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SecretKey))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseExceptionHandlingMiddleware();

// Swagger available in all environments (Render deploy exposes it at /swagger)
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Smart Inventory API v1"));

app.UseResponseCaching();
app.UseRateLimiter();
app.UseHttpsRedirection();
app.UseCors("Production");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Create database tables on startup (EnsureCreated generates schema from the EF model
// — no migration files needed, perfect for a fresh Supabase PostgreSQL database)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
    db.Database.EnsureCreated();

    // Seed admin user if none exists
    if (!db.Users.Any())
    {
        db.Users.Add(new SriLankanCatering.Inventory.Domain.Entities.User
        {
            UserCode = "USR-0001",
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@srilankan.lk",
            PhoneNumber = "+94771234567",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123", workFactor: 11),
            Role = SriLankanCatering.Inventory.Domain.Enums.UserRole.Administrator,
            Status = SriLankanCatering.Inventory.Domain.Enums.UserStatus.Active,
            Department = "IT",
            Designation = "System Administrator",
            MustChangePassword = false,
            FailedLoginAttempts = 0,
            WarehouseId = null,
        });
        db.SaveChanges();
        Log.Information("Admin user seeded: admin@srilankan.lk / password123");
    }
}

app.Run();
