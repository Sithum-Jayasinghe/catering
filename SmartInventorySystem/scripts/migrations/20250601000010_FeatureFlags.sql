CREATE TABLE [FeatureFlags] (
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(100) NOT NULL UNIQUE,
    [IsEnabled] BIT NOT NULL DEFAULT 0,
    [Description] NVARCHAR(500),
    [Environment] NVARCHAR(50) NOT NULL DEFAULT N'Production',
    [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt] DATETIME2
);
INSERT INTO FeatureFlags (Name, IsEnabled, Description, Environment) VALUES
('AiRecommendationsEnabled', 1, 'Enable AI-powered recommendations', 'Production'),
('OcrEnabled', 1, 'Enable OCR document extraction', 'Production'),
('NotificationEnabled', 1, 'Enable push notifications', 'Production'),
('SemanticSearchEnabled', 1, 'Enable semantic search', 'Production'),
('BatchTrackingEnabled', 1, 'Enable batch/lot tracking', 'Production'),
('ExpiryMonitoringEnabled', 1, 'Enable expiry monitoring', 'Production');
