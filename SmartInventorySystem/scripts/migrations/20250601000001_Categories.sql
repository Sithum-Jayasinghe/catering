CREATE TABLE [Categories] (
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(100) NOT NULL,
    [Code] NVARCHAR(20) UNIQUE,
    [Description] NVARCHAR(500) NOT NULL,
    [ParentCategoryId] UNIQUEIDENTIFIER,
    [SortOrder] INT NOT NULL DEFAULT 0,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [Icon] NVARCHAR(100),
    [UserRole] INT NOT NULL,
    [CreatedBy] NVARCHAR(256) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    [UpdatedAt] DATETIME2,
    [IsDeleted] BIT NOT NULL DEFAULT 0,
    [DeletedAt] DATETIME2,
    [DeletedBy] UNIQUEIDENTIFIER,
    CONSTRAINT FK_Categories_Parent FOREIGN KEY (ParentCategoryId) REFERENCES Categories(Id) ON DELETE NO ACTION
);
CREATE INDEX IX_Categories_Code ON Categories(Code) WHERE IsDeleted = 0;
CREATE INDEX IX_Categories_Name ON Categories(Name) WHERE IsDeleted = 0;
