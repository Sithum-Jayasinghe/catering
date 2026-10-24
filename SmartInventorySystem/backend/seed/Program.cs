using BCrypt.Net;
using Microsoft.Data.SqlClient;

const string connStr = "Server=localhost\\SQLEXPRESS;Database=SriLankanCateringInventoryDB;TrustServerCertificate=True;Integrated Security=True;";
const string email = "admin@srilankan.lk";
const string password = "password123";

string hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);
Console.WriteLine($"Hash: {hash}");

await using var conn = new SqlConnection(connStr);
await conn.OpenAsync();

// Check if user already exists
await using var checkCmd = conn.CreateCommand();
checkCmd.CommandText = "SELECT COUNT(1) FROM [Users] WHERE [Email] = @email";
checkCmd.Parameters.AddWithValue("@email", email);
var count = (int)(await checkCmd.ExecuteScalarAsync())!;

if (count > 0)
{
    // Update password and set status to Active
    await using var updCmd = conn.CreateCommand();
    updCmd.CommandText = @"
        UPDATE [Users] SET 
            [PasswordHash] = @hash,
            [Status] = 1,
            [MustChangePassword] = 0,
            [UpdatedAt] = GETUTCDATE()
        WHERE [Email] = @email";
    updCmd.Parameters.AddWithValue("@hash", hash);
    updCmd.Parameters.AddWithValue("@email", email);
    await updCmd.ExecuteNonQueryAsync();
    Console.WriteLine("Existing admin user updated — password reset and status set to Active.");
}
else
{
    await using var insCmd = conn.CreateCommand();
    insCmd.CommandText = @"
        INSERT INTO [Users] (
            [Id], [UserCode], [FirstName], [LastName], [Email], [PhoneNumber],
            [PasswordHash], [Role], [Status], [Department], [Designation],
            [MustChangePassword], [FailedLoginAttempts], [IsDeleted],
            [CreatedAt], [UpdatedAt], [WarehouseId], [RowVersion]
        ) VALUES (
            NEWID(), 'USR-0001', 'Admin', 'User', @email, '+94771234567',
            @hash, 1, 1, 'IT', 'System Administrator',
            0, 0, 0,
            GETUTCDATE(), GETUTCDATE(), NULL, 0x0000000000000001
        )";
    insCmd.Parameters.AddWithValue("@email", email);
    insCmd.Parameters.AddWithValue("@hash", hash);
    await insCmd.ExecuteNonQueryAsync();
    Console.WriteLine("Admin user created successfully.");
}

Console.WriteLine($"Email:    {email}");
Console.WriteLine($"Password: {password}");
