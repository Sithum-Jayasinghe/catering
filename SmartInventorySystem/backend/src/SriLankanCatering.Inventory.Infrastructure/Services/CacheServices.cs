using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using SriLankanCatering.Inventory.Application.Abstractions;
using SriLankanCatering.Inventory.Infrastructure.Configurations;

namespace SriLankanCatering.Inventory.Infrastructure.Services;

public class RedisCacheService : ICacheService
{
    private readonly IDatabase _db;
    private readonly IMemoryCache _memory;
    private readonly RedisSettings _settings;

    public RedisCacheService(IConnectionMultiplexer mux, IOptions<RedisSettings> settings, IMemoryCache memory)
    {
        _db = mux.GetDatabase();
        _settings = settings.Value;
        _memory = memory;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken ct = default)
    {
        try
        {
            var value = await _db.StringGetAsync(BuildKey(key));
            if (!value.HasValue) return default;
            return System.Text.Json.JsonSerializer.Deserialize<T>((string)value!);
        }
        catch { return _memory.TryGetValue(key, out T? val) ? val : default; }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? ttl = null, CancellationToken ct = default)
    {
        try
        {
            var expiry = ttl ?? TimeSpan.FromSeconds(_settings.DefaultTtlSeconds);
            var serialized = System.Text.Json.JsonSerializer.Serialize(value);
            await _db.StringSetAsync(BuildKey(key), serialized, expiry);
        }
        catch { _memory.Set(key, value, ttl ?? TimeSpan.FromSeconds(_settings.DefaultTtlSeconds)); }
    }

    public async Task RemoveAsync(string key, CancellationToken ct = default)
    {
        try { await _db.KeyDeleteAsync(BuildKey(key)); } catch { _memory.Remove(key); }
    }

    public async Task RemoveByPatternAsync(string pattern, CancellationToken ct = default)
    {
        try
        {
            var server = _db.Multiplexer.GetServer(_db.Multiplexer.GetEndPoints().First());
            var keys = server.Keys(pattern: BuildKey(pattern));
            foreach (var key in keys) await _db.KeyDeleteAsync(key);
        }
        catch { _memory.Remove(pattern); }
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken ct = default)
    {
        try { return await _db.KeyExistsAsync(BuildKey(key)); }
        catch { return _memory.TryGetValue(key, out _); }
    }

    public async Task<Dictionary<string, T>> GetAllAsync<T>(IEnumerable<string> keys, CancellationToken ct = default)
    {
        var result = new Dictionary<string, T>();
        foreach (var key in keys)
        {
            var val = await GetAsync<T>(key, ct);
            if (val != null) result[key] = val;
        }
        return result;
    }

    private string BuildKey(string key) => $"{_settings.InstanceName}{key}";
}

public class MemoryCacheService : ICacheService
{
    private readonly IMemoryCache _cache;
    private readonly MemoryCacheOptions _opts;

    public MemoryCacheService(IMemoryCache cache, MemoryCacheOptions opts = null!)
    {
        _cache = cache;
        _opts = opts ?? new MemoryCacheOptions();
    }

    public Task<T?> GetAsync<T>(string key, CancellationToken ct = default)
    {
        _cache.TryGetValue(key, out T? value);
        return Task.FromResult(value);
    }

    public Task SetAsync<T>(string key, T value, TimeSpan? ttl = null, CancellationToken ct = default)
    {
        _cache.Set(key, value, new MemoryCacheEntryOptions { AbsoluteExpirationRelativeToNow = ttl ?? TimeSpan.FromMinutes(5) });
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key, CancellationToken ct = default)
    {
        _cache.Remove(key);
        return Task.CompletedTask;
    }

    public Task RemoveByPatternAsync(string pattern, CancellationToken ct = default) => Task.CompletedTask;
    public Task<bool> ExistsAsync(string key, CancellationToken ct = default)
    {
        return Task.FromResult(_cache.TryGetValue(key, out _));
    }

    public async Task<Dictionary<string, T>> GetAllAsync<T>(IEnumerable<string> keys, CancellationToken ct = default)
    {
        var result = new Dictionary<string, T>();
        foreach (var key in keys)
        {
            var val = await GetAsync<T>(key, ct);
            if (val != null) result[key] = val;
        }
        return result;
    }
}
