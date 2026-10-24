-- CreateSchema.sql
-- Creates all tables from the 20260714070923_InitialCreate migration
-- For SriLankanCateringInventoryDB

SET NOCOUNT ON;
SET XACT_ABORT ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='Warehouses')
BEGIN
CREATE TABLE [Warehouses] (
    [Id] uniqueidentifier NOT NULL,
    [WarehouseCode] nvarchar(450) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Type] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [ContactPerson] nvarchar(max) NULL,
    [ContactPhone] nvarchar(max) NULL,
    [ContactEmail] nvarchar(max) NULL,
    [Capacity] int NOT NULL,
    [CurrentOccupancy] int NOT NULL,
    [OperatingHours] nvarchar(max) NULL,
    [IsActive] bit NOT NULL,
    [OpenedDate] datetime2 NOT NULL,
    [ManagerId] nvarchar(max) NULL,
    [IsColdStorage] bit NOT NULL,
    [IsDryStorage] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] uniqueidentifier NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_Warehouses] PRIMARY KEY ([Id])
);
CREATE UNIQUE INDEX [IX_Warehouses_WarehouseCode] ON [Warehouses] ([WarehouseCode]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='Categories')
BEGIN
CREATE TABLE [Categories] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Code] nvarchar(450) NULL,
    [Description] nvarchar(max) NOT NULL,
    [ParentCategoryId] uniqueidentifier NULL,
    [CreatedBy] nvarchar(max) NOT NULL,
    [SortOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [Icon] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Categories_Categories_ParentCategoryId] FOREIGN KEY ([ParentCategoryId]) REFERENCES [Categories]([Id]) ON DELETE NO ACTION
);
CREATE UNIQUE INDEX [IX_Categories_Code] ON [Categories] ([Code]) WHERE [Code] IS NOT NULL;
CREATE INDEX [IX_Categories_ParentCategoryId] ON [Categories] ([ParentCategoryId]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='Suppliers')
BEGIN
CREATE TABLE [Suppliers] (
    [Id] uniqueidentifier NOT NULL,
    [SupplierCode] nvarchar(450) NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [RegistrationNumber] nvarchar(max) NOT NULL,
    [LegalName] nvarchar(max) NULL,
    [Description] nvarchar(max) NULL,
    [ContactPerson] nvarchar(max) NOT NULL,
    [ContactEmail] nvarchar(max) NOT NULL,
    [ContactPhone] nvarchar(max) NOT NULL,
    [ContactFax] nvarchar(max) NOT NULL,
    [Address_StreetAddress] nvarchar(max) NULL,
    [Address_City] nvarchar(max) NULL,
    [Address_Province] nvarchar(max) NULL,
    [Address_PostalCode] nvarchar(max) NULL,
    [Address_Country] nvarchar(max) NULL,
    [Website] nvarchar(max) NULL,
    [TaxId] nvarchar(max) NULL,
    [VatNumber] nvarchar(max) NULL,
    [PaymentTerms] nvarchar(max) NULL,
    [CreditLimit] int NOT NULL,
    [OutstandingBalance] decimal(18,2) NOT NULL,
    [Status] int NOT NULL,
    [Category] int NOT NULL,
    [PreferredCurrency] nvarchar(max) NULL,
    [PaymentMethod] nvarchar(max) NULL,
    [BankDetails] nvarchar(max) NULL,
    [FoodSafetyCertification] nvarchar(max) NULL,
    [FoodSafetyExpiry] datetime2 NULL,
    [OnTimeDeliveryRate] float NOT NULL,
    [QualityRate] float NOT NULL,
    [AverageLeadTimeDays] float NOT NULL,
    [TotalOrders] decimal(18,2) NOT NULL,
    [TotalValue] decimal(18,2) NOT NULL,
    [Rating] float NOT NULL,
    [Notes] nvarchar(max) NULL,
    [DocumentsPath] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] uniqueidentifier NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_Suppliers] PRIMARY KEY ([Id])
);
CREATE UNIQUE INDEX [IX_Suppliers_SupplierCode] ON [Suppliers] ([SupplierCode]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='Meals')
BEGIN
CREATE TABLE [Meals] (
    [Id] uniqueidentifier NOT NULL,
    [MealCode] nvarchar(max) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [MealType] nvarchar(max) NOT NULL,
    [Category] nvarchar(max) NULL,
    [DefaultServings] int NOT NULL,
    [StandardCost] decimal(18,2) NOT NULL,
    [SalesPrice] decimal(18,2) NOT NULL,
    [TaxCategory] int NOT NULL,
    [PreparationTime] time NULL,
    [CookingTime] time NULL,
    [ImageUrl] nvarchar(max) NULL,
    [IsActive] bit NOT NULL,
    [IsSpecial] bit NOT NULL,
    [NutritionalInfo] nvarchar(max) NULL,
    [AllergenInfo] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] uniqueidentifier NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_Meals] PRIMARY KEY ([Id])
);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='Recipes')
BEGIN
CREATE TABLE [Recipes] (
    [Id] uniqueidentifier NOT NULL,
    [RecipeCode] nvarchar(max) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [MealId] uniqueidentifier NOT NULL,
    [ServingSize] int NOT NULL,
    [CookingInstructions] nvarchar(max) NULL,
    [PreparationTime] time NULL,
    [CookingTime] time NULL,
    [PortionSize] int NOT NULL,
    [Category] nvarchar(max) NULL,
    [IsActive] bit NOT NULL,
    [ValidFrom] datetime2 NULL,
    [ValidTo] datetime2 NULL,
    [CreatedById] uniqueidentifier NOT NULL,
    [ApprovedById] uniqueidentifier NULL,
    [AiOptimizationNotes] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] uniqueidentifier NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_Recipes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Recipes_Meals_MealId] FOREIGN KEY ([MealId]) REFERENCES [Meals]([Id]) ON DELETE NO ACTION
);
CREATE INDEX [IX_Recipes_MealId] ON [Recipes] ([MealId]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='InventoryItems')
BEGIN
CREATE TABLE [InventoryItems] (
    [Id] uniqueidentifier NOT NULL,
    [ItemCode] nvarchar(50) NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [AlternativeNames] nvarchar(max) NULL,
    [Description] nvarchar(max) NULL,
    [CategoryId] uniqueidentifier NOT NULL,
    [VerifiedAt] datetime2 NULL,
    [VerifiedBy] uniqueidentifier NULL,
    [PrimarySupplierId] uniqueidentifier NOT NULL,
    [UnitOfMeasure] nvarchar(max) NOT NULL,
    [ReorderLevel] decimal(18,2) NOT NULL,
    [ReorderQuantity] decimal(18,2) NOT NULL,
    [MaximumStockLevel] decimal(18,2) NOT NULL,
    [MinimumStockLevel] decimal(18,2) NOT NULL,
    [StandardCost] decimal(18,2) NOT NULL,
    [CurrentPrice] decimal(18,2) NOT NULL,
    [StorageType] int NOT NULL,
    [TemperatureZone] int NOT NULL,
    [ShelfLifeDays] int NOT NULL,
    [IsPerishable] bit NOT NULL,
    [IsBatchTracked] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [IsDiscontinued] bit NOT NULL,
    [DiscontinuedDate] datetime2 NULL,
    [Barcode] nvarchar(max) NULL,
    [QrCode] nvarchar(max) NULL,
    [Brand] nvarchar(max) NULL,
    [Model] nvarchar(max) NULL,
    [Specifications] nvarchar(max) NULL,
    [CountryOfOrigin] nvarchar(max) NULL,
    [TotalQuantityOnHand] decimal(18,2) NOT NULL,
    [TotalReservedQuantity] decimal(18,2) NOT NULL,
    [AverageUnitCost] decimal(18,2) NOT NULL,
    [TotalInventoryValue] decimal(18,2) NOT NULL,
    [Status] int NOT NULL,
    [HsnCode] nvarchar(max) NULL,
    [VatCategory] nvarchar(max) NULL,
    [SearchKeywords] nvarchar(max) NULL,
    [AISummary] nvarchar(max) NULL,
    [LastReceiptDate] datetime2 NULL,
    [LastIssueDate] datetime2 NULL,
    [ImageUrl] nvarchar(max) NULL,
    [LastForecastDate] datetime2 NULL,
    [PredictedDemand] decimal(18,2) NOT NULL,
    [DemandVariabilityIndex] float NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] uniqueidentifier NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_InventoryItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_InventoryItems_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories]([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_InventoryItems_Suppliers_PrimarySupplierId] FOREIGN KEY ([PrimarySupplierId]) REFERENCES [Suppliers]([Id]) ON DELETE NO ACTION
);
CREATE UNIQUE INDEX [IX_InventoryItems_ItemCode] ON [InventoryItems] ([ItemCode]);
CREATE INDEX [IX_InventoryItems_CategoryId] ON [InventoryItems] ([CategoryId]);
CREATE INDEX [IX_InventoryItems_PrimarySupplierId] ON [InventoryItems] ([PrimarySupplierId]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='Users')
BEGIN
CREATE TABLE [Users] (
    [Id] uniqueidentifier NOT NULL,
    [UserCode] nvarchar(450) NOT NULL,
    [FirstName] nvarchar(max) NOT NULL,
    [LastName] nvarchar(max) NOT NULL,
    [Email] nvarchar(256) NOT NULL,
    [PhoneNumber] nvarchar(max) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [RefreshToken] nvarchar(max) NULL,
    [RefreshTokenExpiry] datetime2 NULL,
    [Role] int NOT NULL,
    [Status] int NOT NULL,
    [ProfilePictureUrl] nvarchar(max) NULL,
    [Department] nvarchar(max) NULL,
    [Designation] nvarchar(max) NULL,
    [LastLoginAt] datetime2 NULL,
    [LastLoginIp] nvarchar(max) NULL,
    [FailedLoginAttempts] int NOT NULL,
    [LockedUntil] datetime2 NULL,
    [MustChangePassword] bit NOT NULL,
    [WarehouseId] uniqueidentifier NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] uniqueidentifier NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Users_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses]([Id]) ON DELETE NO ACTION
);
CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
CREATE UNIQUE INDEX [IX_Users_UserCode] ON [Users] ([UserCode]);
CREATE INDEX [IX_Users_WarehouseId] ON [Users] ([WarehouseId]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='StorageLocations')
BEGIN
CREATE TABLE [StorageLocations] (
    [Id] uniqueidentifier NOT NULL,
    [LocationCode] nvarchar(max) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [WarehouseId] uniqueidentifier NOT NULL,
    [Zone] nvarchar(max) NOT NULL,
    [Aisle] nvarchar(max) NOT NULL,
    [Rack] nvarchar(max) NOT NULL,
    [Shelf] nvarchar(max) NOT NULL,
    [Position] nvarchar(max) NOT NULL,
    [StorageType] int NOT NULL,
    [TemperatureZone] int NOT NULL,
    [MaxWeightCapacity] decimal(18,2) NOT NULL,
    [CurrentWeight] decimal(18,2) NOT NULL,
    [MaxVolumeCapacity] decimal(18,2) NOT NULL,
    [CurrentVolume] decimal(18,2) NOT NULL,
    [IsActive] bit NOT NULL,
    [Characteristics] nvarchar(max) NULL,
    [Barcode] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] uniqueidentifier NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_StorageLocations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StorageLocations_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses]([Id]) ON DELETE NO ACTION
);
CREATE INDEX [IX_StorageLocations_WarehouseId] ON [StorageLocations] ([WarehouseId]);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='StockBatches')
BEGIN
CREATE TABLE [StockBatches] (
    [Id] uniqueidentifier NOT NULL,
    [BatchNumber] nvarchar(max) NOT NULL,
    [ItemId] uniqueidentifier NOT NULL,
    [StorageLocationId] uniqueidentifier NOT NULL,
    [WarehouseId] uniqueidentifier NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [UnitOfMeasure] nvarchar(max) NOT NULL,
    [ManufacturedDate] datetime2 NOT NULL,
    [ExpiryDate] datetime2 NOT NULL,
    [BestBeforeDate] datetime2 NULL,
    [LotNumber] nvarchar(max) NULL,
    [SerialNumber] nvarchar(max) NULL,
    [Condition] int NOT NULL,
    [QualityGrade] int NOT NULL,
    [SupplierBatchNumber] nvarchar(max) NULL,
    [GoodsReceivedNoteId] uniqueidentifier NULL,
    [RemainingQuantity] decimal(18,2) NOT NULL,
    [IsAllocated] bit NOT NULL,
    [ExpiryNotificationSent] datetime2 NULL,
    [NearingExpiryNotificationSent] datetime2 NULL,
    [ReturnedQuantity] decimal(18,2) NOT NULL,
    [DamagedQuantity] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] uniqueidentifier NULL,
    [UpdatedBy] uniqueidentifier NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] uniqueidentifier NULL,
    [RowVersion] varbinary(max) NOT NULL,
    CONSTRAINT [PK_StockBatches] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StockBatches_InventoryItems_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [InventoryItems]([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_StockBatches_StorageLocations_StorageLocationId] FOREIGN KEY ([StorageLocationId]) REFERENCES [StorageLocations]([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_StockBatches_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses]([Id]) ON DELETE NO ACTION
);
CREATE INDEX [IX_StockBatches_ItemId] ON [StockBatches] ([ItemId]);
CREATE INDEX [IX_StockBatches_StorageLocationId] ON [StockBatches] ([StorageLocationId]);
CREATE INDEX [IX_StockBatches_WarehouseId] ON [StockBatches] ([WarehouseId]);
END
GO