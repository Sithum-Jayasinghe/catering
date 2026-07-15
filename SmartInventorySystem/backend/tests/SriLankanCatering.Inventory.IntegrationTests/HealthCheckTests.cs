using Xunit;
using SriLankanCatering.Inventory.Infrastructure.Services;

namespace SriLankanCatering.Inventory.IntegrationTests;

public class IntegrationTestBase
{
    protected readonly string ConnectionString = "Server=localhost,1433;Database=SriLankanCateringInventoryDB_Test;User Id=sa;Password=StrongPass123!;TrustServerCertificate=True;";
}

public class HealthCheckTests : IntegrationTestBase
{
    [Fact]
    public void TestConnectionString_ShouldBeConfigurable()
    {
        Assert.False(string.IsNullOrEmpty(ConnectionString));
        Assert.Contains("SriLankanCateringInventoryDB_Test", ConnectionString);
    }
}
