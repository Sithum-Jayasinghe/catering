CREATE TABLE [StockBatches] (
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [BatchNumber] NVARCHAR(100) NOT NULL,
    [ItemId] UNIQUEIDENTIFIER NOT NULL,
    [StorageLocationId] UNIQUEIDENTIFIER NOT NULL,
    [WarehouseId] UNIQUEIDENTIFIER NOT NULL,
    [Quantity] DECIMAL(18,3) NOT NULL DEFAULT 0,
    [UnitOfMeasure] NVARCHAR(50) NOT NULL,
    [ManufacturedDate] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    [ExpiryDate] DATETIME2 NOT NULL,
    [BestBeforeDate] DATETIME2,
    [LotNumber] NVARCHAR(100),
    [SerialNumber] NVARCHAR(100),
    [Condition] INT NOT NULL DEFAULT 1,
    [QualityGrade] INT NOT NULL DEFAULT 1,
    [RemainingQuantity] DECIMAL(18,3) NOT NULL DEFAULT 0,
    [IsAllocated] BIT NOT NULL DEFAULT 0,
    [ExpiryNotificationSent] DATETIME2,
    [NearingExpiryNotificationSent] DATETIME2,
    [ReturnedQuantity] DECIMAL(18,3) NOT NULL DEFAULT 0,
    [DamagedQuantity] DECIMAL(18,3) NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt] DATETIME2,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [DeletedAt] DATETIME2,
    [DeletedBy] UNIQUEIDENTIFIER,
    [RowVersion] ROWVERSION
);
CREATE INDEX IX_StockBatches_BatchNumber ON StockBatches(BatchNumber);
CREATE INDEX IX_StockBatches_ItemId ON StockBatches(ItemId);
CREATE INDEX IX_StockBatches_WarehouseId ON StockBatches(WarehouseId);
CREATE INDEX IX_StockBatches_ExpiryDate ON StockBatches(ExpiryDate);