using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Options;
using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Infrastructure.Configurations;

namespace SriLankanCatering.Inventory.Infrastructure.Persistence;

public class InventoryDbContext : DbContext
{
    private readonly DatabaseSettings _dbSettings;

    public InventoryDbContext(DbContextOptions<InventoryDbContext> options, IOptions<DatabaseSettings> dbSettings)
        : base(options)
    {
        _dbSettings = dbSettings.Value;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<UserRolePermission> UserRolePermissions => Set<UserRolePermission>();
    public DbSet<UserClaim> UserClaims => Set<UserClaim>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<StorageLocation> StorageLocations => Set<StorageLocation>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<InventoryItemSupplier> InventoryItemSuppliers => Set<InventoryItemSupplier>();
    public DbSet<SupplierPerformanceLog> SupplierPerformanceLogs => Set<SupplierPerformanceLog>();
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<PurchaseOrderLine> PurchaseOrderLines => Set<PurchaseOrderLine>();
    public DbSet<GoodsReceivedNote> GoodsReceivedNotes => Set<GoodsReceivedNote>();
    public DbSet<GoodsReceivedNoteLine> GoodsReceivedNoteLines => Set<GoodsReceivedNoteLine>();
    public DbSet<StockBatch> StockBatches => Set<StockBatch>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<GoodsIssue> GoodsIssues => Set<GoodsIssue>();
    public DbSet<GoodsIssueLine> GoodsIssueLines => Set<GoodsIssueLine>();
    public DbSet<StockTransfer> StockTransfers => Set<StockTransfer>();
    public DbSet<StockTransferLine> StockTransferLines => Set<StockTransferLine>();
    public DbSet<StockAdjustment> StockAdjustments => Set<StockAdjustment>();
    public DbSet<StockAdjustmentLine> StockAdjustmentLines => Set<StockAdjustmentLine>();
    public DbSet<ReturnItem> ReturnItems => Set<ReturnItem>();
    public DbSet<DamagedItem> DamagedItems => Set<DamagedItem>();
    public DbSet<CycleCount> CycleCounts => Set<CycleCount>();
    public DbSet<CycleCountLine> CycleCountLines => Set<CycleCountLine>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<Meal> Meals => Set<Meal>();
    public DbSet<MealIngredient> MealIngredients => Set<MealIngredient>();
    public DbSet<IngredientDemand> IngredientDemands => Set<IngredientDemand>();
    public DbSet<AiAgentRun> AiAgentRuns => Set<AiAgentRun>();
    public DbSet<AiKnowledgeBase> AiKnowledgeBases => Set<AiKnowledgeBase>();
    public DbSet<AiConversation> AiConversations => Set<AiConversation>();
    public DbSet<AiConversationMessage> AiConversationMessages => Set<AiConversationMessage>();
    public DbSet<AiMcpConnection> AiMcpConnections => Set<AiMcpConnection>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(InventoryDbContext).Assembly);
        var moneyConverter = new SriLankanCatering.Inventory.Infrastructure.Persistence.Configurations.MoneyConverter();
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var foreignKey in entity.GetForeignKeys())
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
        modelBuilder.Entity<StockBatch>(b =>
        {
            b.HasMany(sb => sb.StockMovements)
                .WithOne(sm => sm.Batch)
                .HasForeignKey(sm => sm.BatchId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<StockMovement>(b =>
        {
            b.HasOne(sm => sm.TransferBatch)
                .WithMany()
                .HasForeignKey(sm => sm.TransferBatchId);
            b.Property(p => p.UnitCost).HasConversion(moneyConverter);
            b.Property(p => p.TotalCost).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<CycleCountLine>(b =>
        {
            b.Property(p => p.UnitCost).HasConversion(moneyConverter);
            b.Property(p => p.VarianceValue).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<DamagedItem>(b =>
        {
            b.Property(p => p.UnitCost).HasConversion(moneyConverter);
            b.Property(p => p.TotalValue).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<ReturnItem>(b =>
        {
            b.Property(p => p.UnitPrice).HasConversion(moneyConverter);
            b.Property(p => p.TotalValue).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<StockAdjustmentLine>(b =>
        {
            b.Property(p => p.UnitCost).HasConversion(moneyConverter);
            b.Property(p => p.LineValue).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<StockTransfer>(b =>
        {
            b.Property(p => p.TotalValue).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<GoodsIssueLine>(b =>
        {
            b.Property(p => p.UnitCost).HasConversion(moneyConverter);
            b.Property(p => p.LineAmount).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<GoodsReceivedNoteLine>(b =>
        {
            b.Property(p => p.UnitPrice).HasConversion(moneyConverter);
            b.Property(p => p.LineAmount).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<PurchaseOrderLine>(b =>
        {
            b.Property(p => p.UnitPrice).HasConversion(moneyConverter);
            b.Property(p => p.LineAmount).HasConversion(moneyConverter);
            b.Property(p => p.TaxAmount).HasConversion(moneyConverter);
            b.Property(p => p.DiscountAmount).HasConversion(moneyConverter);
            b.Property(p => p.TotalAmount).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<PurchaseOrder>(b =>
        {
            b.Property(p => p.TotalAmount).HasConversion(moneyConverter);
            b.Property(p => p.DiscountAmount).HasConversion(moneyConverter);
            b.Property(p => p.TaxAmount).HasConversion(moneyConverter);
            b.Property(p => p.FreightCharges).HasConversion(moneyConverter);
            b.Property(p => p.GrandTotal).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<InventoryItem>(b =>
        {
            b.Property(p => p.CurrentPrice).HasConversion(moneyConverter);
            b.Property(p => p.TotalInventoryValue).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<GoodsReceivedNote>(b =>
        {
            b.Property(p => p.TotalValue).HasConversion(moneyConverter);
        });
        modelBuilder.Entity<Supplier>(b =>
        {
            b.OwnsOne(s => s.Address, a =>
            {
                a.Property(p => p.StreetAddress).HasColumnName("Address_StreetAddress");
                a.Property(p => p.City).HasColumnName("Address_City");
                a.Property(p => p.Province).HasColumnName("Address_Province");
                a.Property(p => p.PostalCode).HasColumnName("Address_PostalCode");
                a.Property(p => p.Country).HasColumnName("Address_Country");
            });
        });
        modelBuilder.Entity<GoodsIssue>(b =>
        {
            b.HasOne(g => g.Warehouse)
                .WithMany()
                .HasForeignKey(g => g.WarehouseId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<StockTransfer>(b =>
        {
            b.HasOne(st => st.FromWarehouse)
                .WithMany()
                .HasForeignKey(st => st.FromWarehouseId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<InventoryItem>(b =>
        {
            b.HasOne(ii => ii.PrimarySupplier)
                .WithMany()
                .HasForeignKey(ii => ii.PrimarySupplierId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<InventoryItemSupplier>(b =>
        {
            b.HasOne(iis => iis.Supplier)
                .WithMany(s => s.InventoryItemSuppliers)
                .HasForeignKey(iis => iis.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.UpdatedAt = now;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    break;
            }
        }
        return await base.SaveChangesAsync(cancellationToken);
    }
}
