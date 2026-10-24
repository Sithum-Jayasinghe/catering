-- SeedSampleData.sql
-- Sample data for SriLankanCateringInventoryDB
-- Connection: Server=localhost\SQLEXPRESS;Database=SriLankanCateringInventoryDB;Trusted_Connection=True;TrustServerCertificate=True

SET NOCOUNT ON;
SET XACT_ABORT ON;

-- Admin user (password123, BCrypt hash)
IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Email] = 'admin@srilankan.lk')
BEGIN
    INSERT INTO [Users] ([Id],[UserCode],[FirstName],[LastName],[Email],[PhoneNumber],[PasswordHash],[Role],[Status],[Designation],[MustChangePassword],[FailedLoginAttempts],[IsDeleted],[CreatedAt],[UpdatedAt],[RowVersion])
    VALUES (NEWID(),'USR-0001','Admin','User','admin@srilankan.lk','+94771234567','$2a$11$K.zVJNf3k8nAh1BhGE7xpO6KY3cUFjmzgCUiYyZ7vRs7Vq.3RBgPy',1,1,'System Administrator',0,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()));
END
GO

-- Warehouses
IF NOT EXISTS (SELECT 1 FROM [Warehouses])
BEGIN
    INSERT INTO [Warehouses] ([Id],[WarehouseCode],[Name],[Description],[Type],[Status],[ContactPerson],[ContactPhone],[ContactEmail],[Capacity],[CurrentOccupancy],[OperatingHours],[IsActive],[OpenedDate],[IsColdStorage],[IsDryStorage],[IsDeleted],[CreatedAt],[UpdatedAt],[RowVersion])
    VALUES
    (NEWID(),'WH-MAIN','Main Distribution Centre','Central warehouse for all goods','Central',1,'Admin User','+94112345678','admin@srilankan.lk',5000,1200,'06:00-22:00',1,GETUTCDATE(),0,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID())),
    (NEWID(),'WH-COLD','Cold Storage Facility','Temperature controlled storage','Cold',1,'Admin User','+94112345678','admin@srilankan.lk',2000,450,'24 Hours',1,GETUTCDATE(),1,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID())),
    (NEWID(),'WH-KANDY','Kandy Branch Warehouse','Branch warehouse for Kandy region','Branch',1,'Admin User','+94112345678','admin@srilankan.lk',1000,300,'07:00-20:00',1,GETUTCDATE(),0,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID())),
    (NEWID(),'WH-COLOMBO','Colombo Outlet','Outlet warehouse for Colombo','Outlet',1,'Admin User','+94112345678','admin@srilankan.lk',500,200,'08:00-21:00',1,GETUTCDATE(),0,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()));
END
GO

-- Categories
IF NOT EXISTS (SELECT 1 FROM [Categories])
BEGIN
    INSERT INTO [Categories] ([Id],[Name],[Code],[Description],[SortOrder],[IsActive],[IsDeleted],[CreatedAt],[UpdatedAt],[RowVersion],[CreatedBy])
    VALUES
    (NEWID(),'Vegetables','CAT-VEG','Fresh vegetables and produce',1,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System'),
    (NEWID(),'Fruits','CAT-FRU','Fresh fruits and tropical fruits',2,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System'),
    (NEWID(),'Proteins','CAT-PROT','Meat, poultry, fish and seafood',3,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System'),
    (NEWID(),'Dairy','CAT-DAIR','Milk, cheese, butter and dairy products',4,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System'),
    (NEWID(),'Grains','CAT-GRAI','Rice, flour, cereals and staples',5,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System'),
    (NEWID(),'Spices','CAT-SPC','Spices, herbs and seasonings',6,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System'),
    (NEWID(),'Oils','CAT-OIL','Cooking oils and ghee',7,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System'),
    (NEWID(),'Sweets','CAT-SWE','Sweets, desserts and confectionery',8,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System');
END
GO

-- Inventory Items
IF NOT EXISTS (SELECT 1 FROM [InventoryItems])
BEGIN
    DECLARE @CatVeg uniqueidentifier = (SELECT Id FROM Categories WHERE Code='CAT-VEG');
    DECLARE @CatGrai uniqueidentifier = (SELECT Id FROM Categories WHERE Code='CAT-GRAI');
    DECLARE @CatProt uniqueidentifier = (SELECT Id FROM Categories WHERE Code='CAT-PROT');
    DECLARE @CatDair uniqueidentifier = (SELECT Id FROM Categories WHERE Code='CAT-DAIR');
    DECLARE @CatOil uniqueidentifier = (SELECT Id FROM Categories WHERE Code='CAT-OIL');
    DECLARE @CatSwe uniqueidentifier = (SELECT Id FROM Categories WHERE Code='CAT-SWE');
    DECLARE @Sup001 uniqueidentifier = (SELECT Id FROM Suppliers WHERE SupplierCode='SUP-0001');
    DECLARE @Sup002 uniqueidentifier = (SELECT Id FROM Suppliers WHERE SupplierCode='SUP-0002');
    DECLARE @Sup003 uniqueidentifier = (SELECT Id FROM Suppliers WHERE SupplierCode='SUP-0003');
    DECLARE @Sup004 uniqueidentifier = (SELECT Id FROM Suppliers WHERE SupplierCode='SUP-0004');
    DECLARE @Sup005 uniqueidentifier = (SELECT Id FROM Suppliers WHERE SupplierCode='SUP-0005');
    INSERT INTO [InventoryItems] ([Id],[ItemCode],[Name],[Description],[CategoryId],[PrimarySupplierId],[UnitOfMeasure],[ReorderLevel],[ReorderQuantity],[MaximumStockLevel],[MinimumStockLevel],[StandardCost],[CurrentPrice],[StorageType],[TemperatureZone],[ShelfLifeDays],[IsPerishable],[IsBatchTracked],[IsActive],[IsDiscontinued],[TotalQuantityOnHand],[TotalReservedQuantity],[AverageUnitCost],[TotalInventoryValue],[Status],[IsDeleted],[CreatedAt],[UpdatedAt],[RowVersion],[PredictedDemand],[DemandVariabilityIndex])
    VALUES
    (NEWID(),'ITM-0001','Basmati Rice (Extra Long Grain)','Premium long grain basmati rice',@CatGrai,@Sup001,'KG',500,250,1000,250,180.00,220.00,1,1,365,0,0,1,0,800,0,180.00,144000.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),600,0.15),
    (NEWID(),'ITM-0002','Potatoes','Fresh potatoes',@CatVeg,@Sup002,'KG',200,100,500,100,60.00,85.00,1,1,14,1,0,1,0,350,0,60.00,21000.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),280,0.25),
    (NEWID(),'ITM-0003','Tomatoes','Fresh tomatoes',@CatVeg,@Sup002,'KG',100,50,300,50,90.00,140.00,1,1,7,1,0,1,0,180,0,90.00,16200.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),200,0.30),
    (NEWID(),'ITM-0004','Onions','Fresh onions',@CatVeg,@Sup002,'KG',150,75,400,75,70.00,100.00,1,1,21,1,0,1,0,250,0,70.00,17500.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),200,0.20),
    (NEWID(),'ITM-0005','Chicken Breast (Boneless)','Fresh chicken breast',@CatProt,@Sup004,'KG',80,40,200,40,450.00,580.00,2,2,5,1,1,1,0,120,0,450.00,54000.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),150,0.18),
    (NEWID(),'ITM-0006','Fresh Milk (1L)','Fresh milk 1 litre',@CatDair,@Sup003,'L',60,30,150,30,120.00,150.00,2,2,7,1,1,1,0,90,0,120.00,10800.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),100,0.22),
    (NEWID(),'ITM-0007','Coconut Oil','Pure coconut oil',@CatOil,@Sup001,'L',100,50,300,50,250.00,320.00,1,1,365,0,0,1,0,200,0,250.00,50000.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),250,0.10),
    (NEWID(),'ITM-0008','Fish (Tuna - Canned)','Canned tuna fish',@CatProt,@Sup005,'PCS',200,100,500,100,180.00,240.00,1,1,730,0,0,1,0,350,0,180.00,63000.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),400,0.12),
    (NEWID(),'ITM-0009','Ras Malai','Traditional sweet',@CatSwe,@Sup001,'PCS',50,25,150,25,350.00,450.00,1,1,14,1,0,1,0,80,0,350.00,28000.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),100,0.28),
    (NEWID(),'ITM-0010','Lanka Samba Rice','Traditional Sri Lankan samba rice',@CatGrai,@Sup001,'KG',300,150,800,150,140.00,180.00,1,1,365,0,0,1,0,500,0,140.00,70000.00,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),400,0.14);
END
GO

-- Meals
IF NOT EXISTS (SELECT 1 FROM [Meals])
BEGIN
    INSERT INTO [Meals] ([Id],[MealCode],[Name],[Description],[MealType],[Category],[DefaultServings],[StandardCost],[SalesPrice],[TaxCategory],[PreparationTime],[CookingTime],[IsActive],[IsSpecial],[IsDeleted],[CreatedAt],[UpdatedAt],[RowVersion],[CreatedBy],[UpdatedBy])
    VALUES
    (NEWID(),'MEAL-0001','Rice and Curry','Traditional Sri Lankan rice and curry',1,1,4,350.00,550.00,1,'00:30:00','00:30:00',1,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'MEAL-0002','Fried Rice','Chinese style fried rice',1,1,2,200.00,320.00,1,'00:20:00','00:20:00',1,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'MEAL-0003','Biryani','Spicy biryani',1,1,4,450.00,700.00,1,'01:00:00','00:45:00',1,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'MEAL-0004','Vegetable Noodles','Vegetable noodles',1,1,2,180.00,280.00,1,'00:25:00','00:20:00',1,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'MEAL-0005','Chicken Devilled','Spicy chicken devilled',1,1,4,500.00,780.00,1,'00:40:00','00:30:00',1,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'MEAL-0006','Fish Curry','Traditional fish curry',1,1,4,400.00,650.00,1,'00:35:00','00:30:00',1,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'MEAL-0007','Kottu Roti (Chicken)','Chicken kottu roti',1,1,2,280.00,450.00,1,'00:30:00','00:25:00',1,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'MEAL-0008','Creamy Pasta','Creamy pasta',1,1,2,320.00,500.00,1,'00:30:00','00:25:00',1,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL);
END
GO

-- Storage Locations
IF NOT EXISTS (SELECT 1 FROM [StorageLocations])
BEGIN
    DECLARE @WhMain uniqueidentifier = (SELECT Id FROM Warehouses WHERE WarehouseCode='WH-MAIN');
    DECLARE @WhCold uniqueidentifier = (SELECT Id FROM Warehouses WHERE WarehouseCode='WH-COLD');
    DECLARE @WhKandy uniqueidentifier = (SELECT Id FROM Warehouses WHERE WarehouseCode='WH-KANDY');
    INSERT INTO [StorageLocations] ([Id],[LocationCode],[Name],[WarehouseId],[Zone],[Aisle],[Rack],[Shelf],[Position],[StorageType],[TemperatureZone],[MaxWeightCapacity],[CurrentWeight],[MaxVolumeCapacity],[CurrentVolume],[IsActive],[IsDeleted],[CreatedAt],[UpdatedAt],[RowVersion],[CreatedBy],[UpdatedBy])
    VALUES
    (NEWID(),'SL-0001','Dry Aisle A Rack 1',@WhMain,'A','A','R1','S1','P1',1,1,5000,1200,5000,300,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'SL-0002','Dry Aisle A Rack 2',@WhMain,'A','A','R2','S1','P1',1,1,5000,800,5000,200,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'SL-0003','Cold Aisle B Rack 1',@WhCold,'B','B','R1','S1','P1',2,2,3000,450,3000,150,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL),
    (NEWID(),'SL-0004','Kandy Dry Aisle A',@WhKandy,'A','A','R1','S1','P1',1,1,2000,300,2000,100,1,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL);
END
GO

-- Stock Batches
IF NOT EXISTS (SELECT 1 FROM [StockBatches])
BEGIN
    DECLARE @Item001 uniqueidentifier = (SELECT Id FROM InventoryItems WHERE ItemCode='ITM-0001');
    DECLARE @Item002 uniqueidentifier = (SELECT Id FROM InventoryItems WHERE ItemCode='ITM-0002');
    DECLARE @Item003 uniqueidentifier = (SELECT Id FROM InventoryItems WHERE ItemCode='ITM-0003');
    DECLARE @Item005 uniqueidentifier = (SELECT Id FROM InventoryItems WHERE ItemCode='ITM-0005');
    DECLARE @Item006 uniqueidentifier = (SELECT Id FROM InventoryItems WHERE ItemCode='ITM-0006');
    DECLARE @Item007 uniqueidentifier = (SELECT Id FROM InventoryItems WHERE ItemCode='ITM-0007');
    DECLARE @Item008 uniqueidentifier = (SELECT Id FROM InventoryItems WHERE ItemCode='ITM-0008');
    DECLARE @Item010 uniqueidentifier = (SELECT Id FROM InventoryItems WHERE ItemCode='ITM-0010');
    DECLARE @Loc001 uniqueidentifier = (SELECT Id FROM StorageLocations WHERE LocationCode='SL-0001');
    DECLARE @Loc003 uniqueidentifier = (SELECT Id FROM StorageLocations WHERE LocationCode='SL-0003');
    DECLARE @Loc004 uniqueidentifier = (SELECT Id FROM StorageLocations WHERE LocationCode='SL-0004');
    DECLARE @WhMain uniqueidentifier = (SELECT Id FROM Warehouses WHERE WarehouseCode='WH-MAIN');
    DECLARE @WhCold uniqueidentifier = (SELECT Id FROM Warehouses WHERE WarehouseCode='WH-COLD');
    DECLARE @WhKandy uniqueidentifier = (SELECT Id FROM Warehouses WHERE WarehouseCode='WH-KANDY');
    INSERT INTO [StockBatches] ([Id],[BatchNumber],[ItemId],[StorageLocationId],[WarehouseId],[Quantity],[UnitOfMeasure],[ManufacturedDate],[ExpiryDate],[BestBeforeDate],[LotNumber],[RemainingQuantity],[IsAllocated],[IsDeleted],[CreatedAt],[UpdatedAt],[RowVersion],[CreatedBy],[UpdatedBy],[Condition],[QualityGrade],[ReturnedQuantity],[DamagedQuantity])
    VALUES
    (NEWID(),'BCH-ITM-0001-001',@Item001,@Loc001,@WhMain,500.00,'KG','2026-08-01','2027-08-01',NULL,'LOT-RICE-001',500.00,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL,1,1,0.00,0.00),
    (NEWID(),'BCH-ITM-0002-001',@Item002,@Loc001,@WhMain,350.00,'KG','2026-09-15','2026-09-29',NULL,'LOT-POT-001',350.00,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL,1,1,0.00,0.00),
    (NEWID(),'BCH-ITM-0003-001',@Item003,@Loc001,@WhMain,180.00,'KG','2026-09-25','2026-10-02',NULL,'LOT-TOM-001',180.00,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL,1,1,0.00,0.00),
    (NEWID(),'BCH-ITM-0005-001',@Item005,@Loc003,@WhCold,120.00,'KG','2026-09-28','2026-10-03',NULL,'LOT-CHICK-001',120.00,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL,1,1,0.00,0.00),
    (NEWID(),'BCH-ITM-0006-001',@Item006,@Loc003,@WhCold,90.00,'L','2026-09-29','2026-10-06',NULL,'LOT-MILK-001',90.00,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL,1,1,0.00,0.00),
    (NEWID(),'BCH-ITM-0007-001',@Item007,@Loc001,@WhMain,200.00,'L','2026-07-15','2027-07-15',NULL,'LOT-OIL-001',200.00,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL,1,1,0.00,0.00),
    (NEWID(),'BCH-ITM-0008-001',@Item008,@Loc001,@WhMain,350.00,'PCS','2026-01-01','2028-01-01',NULL,'LOT-FISH-001',350.00,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL,1,1,0.00,0.00),
    (NEWID(),'BCH-ITM-0010-001',@Item010,@Loc004,@WhKandy,500.00,'KG','2026-08-20','2027-08-20',NULL,'LOT-RICE-002',500.00,0,0,GETUTCDATE(),GETUTCDATE(),CONVERT(varbinary(max), NEWID()),'System',NULL,1,1,0.00,0.00);
END
GO

-- Summary
SELECT 'Seed data loaded successfully' AS [Status],
       (SELECT COUNT(*) FROM [Users]) AS [Users],
       (SELECT COUNT(*) FROM [Warehouses]) AS [Warehouses],
       (SELECT COUNT(*) FROM [Categories]) AS [Categories],
       (SELECT COUNT(*) FROM [Suppliers]) AS [Suppliers],
       (SELECT COUNT(*) FROM [InventoryItems]) AS [InventoryItems],
       (SELECT COUNT(*) FROM [Meals]) AS [Meals],
       (SELECT COUNT(*) FROM [StorageLocations]) AS [StorageLocations],
       (SELECT COUNT(*) FROM [StockBatches]) AS [StockBatches];