-- Seed admin user for Supabase PostgreSQL
-- Password: password123  (BCrypt hash)
-- Email: admin@srilankan.lk
-- Role: 1 = Administrator, Status: 1 = Active

INSERT INTO "Users" (
    "Id",
    "UserCode",
    "FirstName",
    "LastName",
    "Email",
    "PhoneNumber",
    "PasswordHash",
    "Role",
    "Status",
    "Department",
    "Designation",
    "MustChangePassword",
    "FailedLoginAttempts",
    "IsDeleted",
    "CreatedAt",
    "UpdatedAt",
    "WarehouseId",
    "RowVersion"
)
SELECT
    gen_random_uuid(),
    'USR-0001',
    'Admin',
    'User',
    'admin@srilankan.lk',
    '+94771234567',
    '$2a$11$K.zVJNf3k8nAh1BhGE7xpO6KY3cUFjmzgCUiYyZ7vRs7Vq.3RBgPy',
    1,
    1,
    'IT',
    'System Administrator',
    false,
    0,
    false,
    now() at time zone 'utc',
    now() at time zone 'utc',
    NULL,
    E'\\x00000000000000000000000000000001'
WHERE NOT EXISTS (
    SELECT 1 FROM "Users" WHERE "Email" = 'admin@srilankan.lk'
);
