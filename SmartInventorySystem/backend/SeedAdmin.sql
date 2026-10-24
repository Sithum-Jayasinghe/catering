-- Seed admin user for SriLankanCateringInventoryDB
-- Password: password123  (BCrypt hash)
-- Email: admin@srilankan.lk
-- Role: 1 = Administrator, Status: 1 = Active

-- First check if user already exists
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Email] = 'admin@srilankan.lk')
BEGIN
    INSERT INTO [Users] (
        [Id],
        [UserCode],
        [FirstName],
        [LastName],
        [Email],
        [PhoneNumber],
        [PasswordHash],
        [Role],
        [Status],
        [Department],
        [Designation],
        [MustChangePassword],
        [FailedLoginAttempts],
        [IsDeleted],
        [CreatedAt],
        [UpdatedAt],
        [WarehouseId],
        [RowVersion]
    )
    VALUES (
        NEWID(),
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
        0,
        0,
        0,
        GETUTCDATE(),
        GETUTCDATE(),
        NULL,
        0x00000000000000000000000000000001
    )
    PRINT 'Admin user created successfully.'
END
ELSE
BEGIN
    PRINT 'Admin user already exists.'
END
