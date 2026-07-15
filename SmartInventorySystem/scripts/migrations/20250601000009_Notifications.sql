CREATE TABLE [Notifications] (
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [Title] NVARCHAR(200),
    [Message] NVARCHAR(MAX) NOT NULL,
    [Type] INT NOT NULL,
    [Channel] INT NOT NULL DEFAULT 1,
    [Priority] INT NOT NULL DEFAULT 2,
    [ContextData] NVARCHAR(MAX),
    [ActionUrl] NVARCHAR(500),
    [SentAt] DATETIME2,
    [ReadAt] DATETIME2,
    [DismissedAt] DATETIME2,
    [IsRead] BIT NOT NULL DEFAULT 0,
    [IsDismissed] BIT NOT NULL DEFAULT 0,
    [ErrorMessage] NVARCHAR(MAX),
    [RetryCount] INT NOT NULL DEFAULT 0,
    [LastRetryAt] DATETIME2,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    [IsDeleted] BIT NOT NULL DEFAULT 0
);
CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);
CREATE INDEX IX_Notifications_Type ON Notifications(Type);

CREATE TABLE [AuditLogs] (
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [Action] NVARCHAR(100) NOT NULL,
    [EntityType] NVARCHAR(100),
    [EntityId] UNIQUEIDENTIFIER,
    [EntityName] NVARCHAR(200),
    [OldValue] NVARCHAR(MAX),
    [NewValue] NVARCHAR(MAX),
    [IpAddress] NVARCHAR(50),
    [UserAgent] NVARCHAR(500),
    [Module] NVARCHAR(100),
    [SubModule] NVARCHAR(100),
    [SessionId] NVARCHAR(100),
    [Level] INT NOT NULL DEFAULT 1,
    [Message] NVARCHAR(MAX),
    [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    [IsDeleted] BIT NOT NULL DEFAULT 0
);
CREATE INDEX IX_AuditLogs_UserId ON AuditLogs(UserId);
CREATE INDEX IX_AuditLogs_CreatedAt ON AuditLogs(CreatedAt);
CREATE INDEX IX_AuditLogs_Entity ON AuditLogs(EntityType, EntityId);