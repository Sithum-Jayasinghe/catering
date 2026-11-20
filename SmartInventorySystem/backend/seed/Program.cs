using BCrypt.Net;
using Npgsql;

// Supabase PostgreSQL connection — set via env var or edit directly
const string connStr = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? "Host=db.adstcemhpbuzmomrbqko.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=Sithum_123;SSL Mode=Require;Trust Server Certificate=true";
const string email = "admin@srilankan.lk";
const string password = "password123";

string hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);
Console.WriteLine($"Hash: {hash}");

await using var conn = new NpgsqlConnection(connStr);
await conn.OpenAsync();

// Check if user already exists
await using var checkCmd = conn.CreateCommand();
checkCmd.CommandText = "SELECT COUNT(*) FROM \"Users\" WHERE \"Email\" = @email";
checkCmd.Parameters.AddWithValue("@email", email);
var count = (long)(await checkCmd.ExecuteScalarAsync())!;

if (count > 0)
{
    // Update password and set status to Active
    await using var updCmd = conn.CreateCommand();
    updCmd.CommandText = @"
        UPDATE ""Users"" SET
            ""PasswordHash"" = @hash,
            ""Status"" = 1,
            ""MustChangePassword"" = false,
            ""UpdatedAt"" = now() at time zone 'utc'
        WHERE ""Email"" = @email";
    updCmd.Parameters.AddWithValue("@hash", hash);
    updCmd.Parameters.AddWithValue("@email", email);
    await updCmd.ExecuteNonQueryAsync();
    Console.WriteLine("Existing admin user updated — password reset and status set to Active.");
}
else
{
    await using var insCmd = conn.CreateCommand();
    insCmd.CommandText = @"
        INSERT INTO ""Users"" (
            ""Id"", ""UserCode"", ""FirstName"", ""LastName"", ""Email"", ""PhoneNumber"",
            ""PasswordHash"", ""Role"", ""Status"", ""Department"", ""Designation"",
            ""MustChangePassword"", ""FailedLoginAttempts"", ""IsDeleted"",
            ""CreatedAt"", ""UpdatedAt"", ""WarehouseId"", ""RowVersion""
        ) VALUES (
            gen_random_uuid(), 'USR-0001', 'Admin', 'User', @email, '+94771234567',
            @hash, 1, 1, 'IT', 'System Administrator',
            false, 0, false,
            now() at time zone 'utc', now() at time zone 'utc', NULL, E'\\x0000000000000001'
        )";
    insCmd.Parameters.AddWithValue("@email", email);
    insCmd.Parameters.AddWithValue("@hash", hash);
    await insCmd.ExecuteNonQueryAsync();
    Console.WriteLine("Admin user created successfully.");
}

Console.WriteLine($"Email:    {email}");
Console.WriteLine($"Password: {password}");
