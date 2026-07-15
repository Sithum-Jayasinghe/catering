CREATE TABLE [StockMovements] (
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [ItemId] UNIQUEIDENTIFIER NOT NULL,
    [BatchId] UNIQUEIDENTIFIER NOT NULL,
    [WarehouseId] UNIQUEIDENTIFIER NOT NULL,
    [StorageLocationId] UNIQUEIDENTIFIER NOT NULL,
    [MovementType] INT NOT NULL,
    [Source] INT NOT NULL,
    [SourceDocumentId] UNIQUEIDENTIFIER NOT NULL,
    [Quantity] DECIMAL(18,3) NOT NULL,
    [UnitOfMeasure] NVARCHAR(50) NOT NULL,
    [UnitCost] DECIMAL(18,3),
    [TotalCost] DECIMAL(18,3),
    [QuantityBefore] DECIMAL(18,3) NOT NULL,
    [QuantityAfter] DECIMAL(18,3) NOT NULL,
    [ReferenceNumber] NVARCHAR(100),
    [Notes] NVARCHAR(500),
    [PerformedBy] UNIQUEIDENTIFIER,
    [ApprovedBy] UNIQUEIDENTIFIER,
    [ApprovedAt] DATETIME2,
    [DocumentNumber] NVARCHAR(100),
    [TransferBatchId] UNIQUEIDENTIFIER,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    [CreatedBy] NVARCHAR(256),
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [DeletedAt] DATETIME2,
    [DeletedBy] UNIQUEIDENTIFIER,
    [RowVersion] ROWVERSION
);
CREATE INDEX IX_StockMovements_ItemId ON StockMovements(ItemId);
CREATE INDEX IX_StockMovements_WarehouseId ON StockMovements(WarehouseId);
CREATE INDEX IX_StockMovements_CreatedAt ON StockMovements(CreatedAt);
CREATE INDEX IX_StockMovements_MovementType ON StockMovements(MovementType);
