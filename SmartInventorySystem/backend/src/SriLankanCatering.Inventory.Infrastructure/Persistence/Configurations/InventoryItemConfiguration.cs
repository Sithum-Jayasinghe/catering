using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Infrastructure.Persistence.Configurations;

public class InventoryItemConfiguration : IEntityTypeConfiguration<InventoryItem>
{
    public void Configure(EntityTypeBuilder<InventoryItem> builder)
    {
        builder.ToTable("InventoryItems");
        builder.HasKey(i => i.Id);
        builder.HasIndex(i => i.ItemCode).IsUnique();
        builder.Property(i => i.ItemCode).IsRequired().HasMaxLength(50);
        builder.Property(i => i.Name).IsRequired().HasMaxLength(200);
        builder.Property(i => i.TotalQuantityOnHand).HasDefaultValue(0);
        builder.Property(i => i.Status).HasDefaultValue(InventoryStatus.Available);
        builder.Property(i => i.IsPerishable).HasDefaultValue(true);
        builder.Property(i => i.StorageType).HasConversion<int>();
        builder.Property(i => i.TemperatureZone).HasConversion<int>();
        builder.Property(i => i.CurrentPrice).HasConversion(new MoneyConverter());
        builder.Property(i => i.TotalInventoryValue).HasConversion(new MoneyConverter());
        builder.Property(i => i.AverageUnitCost).HasColumnType("decimal(18,2)");
    }
}
