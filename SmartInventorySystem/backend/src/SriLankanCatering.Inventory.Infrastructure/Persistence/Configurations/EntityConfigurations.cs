using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Infrastructure.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        builder.HasKey(c => c.Id);
        builder.HasIndex(c => c.Code).IsUnique().HasFilter("\"Code\" IS NOT NULL");
        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.HasOne(c => c.ParentCategory).WithMany(c => c.SubCategories).HasForeignKey(c => c.ParentCategoryId).OnDelete(Microsoft.EntityFrameworkCore.DeleteBehavior.Restrict);
    }
}

public class WarehouseConfiguration : IEntityTypeConfiguration<Warehouse>
{
    public void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        builder.ToTable("Warehouses");
        builder.HasKey(w => w.Id);
        builder.HasIndex(w => w.WarehouseCode).IsUnique();
        builder.Property(w => w.Name).IsRequired().HasMaxLength(100);
    }
}

public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        builder.ToTable("Suppliers");
        builder.HasKey(s => s.Id);
        builder.HasIndex(s => s.SupplierCode).IsUnique();
        builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Rating).HasDefaultValue(0);
    }
}

public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
{
    public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.ToTable("PurchaseOrders");
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => p.PONumber).IsUnique();
        builder.Property(p => p.PONumber).IsRequired().HasMaxLength(50);
        builder.Property(p => p.GrandTotal).HasColumnType("decimal(18,2)");
        builder.HasMany(p => p.Lines)
            .WithOne(l => l.PurchaseOrder)
            .HasForeignKey(l => l.PurchaseOrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class GoodsReceivedNoteConfiguration : IEntityTypeConfiguration<GoodsReceivedNote>
{
    public void Configure(EntityTypeBuilder<GoodsReceivedNote> builder)
    {
        builder.ToTable("GoodsReceivedNotes");
        builder.HasKey(g => g.Id);
        builder.HasIndex(g => g.GrnNumber).IsUnique();
        builder.Property(g => g.GrnNumber).IsRequired().HasMaxLength(50);
        builder.HasMany(g => g.Lines)
            .WithOne(l => l.GoodsReceivedNote)
            .HasForeignKey(l => l.GoodsReceivedNoteId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
