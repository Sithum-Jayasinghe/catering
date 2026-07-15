using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SriLankanCatering.Inventory.Domain.Common;

namespace SriLankanCatering.Inventory.Infrastructure.Persistence.Configurations;

public class MoneyConverter : ValueConverter<Money, decimal>
{
    public MoneyConverter() : base(
        v => v.Amount,
        v => new Money(v, "LKR")) { }
}
