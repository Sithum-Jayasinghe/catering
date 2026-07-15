using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SriLankanCatering.Inventory.Domain.Entities;
using SriLankanCatering.Inventory.Domain.Enums;

namespace SriLankanCatering.Inventory.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasIndex(u => u.UserCode).IsUnique();
        builder.Property(u => u.Email).IsRequired().HasMaxLength(256);
        builder.Property(u => u.PasswordHash).IsRequired();
        builder.Property(u => u.Role).HasDefaultValue(UserRole.StoreKeeper);
        builder.Property(u => u.Status).HasDefaultValue(UserStatus.Pending);
    }
}
