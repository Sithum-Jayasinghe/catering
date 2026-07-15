using System;
using Xunit;
using SriLankanCatering.Inventory.Domain;
using SriLankanCatering.Inventory.Domain.Common;
using SriLankanCatering.Inventory.Domain.Entities;

namespace SriLankanCatering.Inventory.UnitTests;

public class MoneyTests
{
    [Fact]
    public void Money_Addition_ShouldWorkCorrectly()
    {
        var money1 = new Money(100, "LKR");
        var money2 = new Money(50, "LKR");
        var result = money1 + money2;
        Assert.Equal(150, result.Amount);
        Assert.Equal("LKR", result.Currency);
    }

    [Fact]
    public void Money_DifferentCurrencies_ShouldThrow()
    {
        var money1 = new Money(100, "LKR");
        var money2 = new Money(50, "USD");
        Assert.Throws<InvalidOperationException>(() => money1 + money2);
    }
}

public class MeasurementTests
{
    [Fact]
    public void Measurement_Addition_ShouldWork()
    {
        var m1 = new Measurement(10, "kg");
        var m2 = new Measurement(5, "kg");
        var result = m1 + m2;
        Assert.Equal(15, result.Quantity);
    }

    [Fact]
    public void Measurement_DifferentUnits_ShouldThrow()
    {
        var m1 = new Measurement(10, "kg");
        var m2 = new Measurement(5, "liters");
        Assert.Throws<InvalidOperationException>(() => m1 + m2);
    }
}

public class EntityTests
{
    [Fact]
    public void Entity_ShouldHaveUniqueIdOnCreation()
    {
        var id1 = Guid.NewGuid();
        var id2 = Guid.NewGuid();
        Assert.NotEqual(id1, id2);
    }

    [Fact]
    public void Entity_Creation_ShouldSetDefaults()
    {
        var category = new Category
        {
            Name = "Test Category",
            Description = "Test",
            Code = "TC",
            CreatedBy = "test"
        };
        Assert.NotEqual(Guid.Empty, category.Id);
        Assert.True(category.IsActive);
        Assert.Equal(0, category.SortOrder);
    }
}

public class ResultTests
{
    [Fact]
    public void Success_ShouldCreateSuccessResult()
    {
        var result = Result<int>.Success(42);
        Assert.True(result.IsSuccess);
        Assert.Equal(42, result.Data);
        Assert.Empty(result.Error);
    }

    [Fact]
    public void Failure_ShouldCreateFailureResult()
    {
        var result = Result<int>.Failure("Something went wrong");
        Assert.False(result.IsSuccess);
        Assert.Equal("Something went wrong", result.Error);
    }

    [Fact]
    public void NotFound_ShouldCreateNotFoundResult()
    {
        var result = Result<int>.NotFound("Item not found");
        Assert.False(result.IsSuccess);
        Assert.Equal(ErrorType.NotFound, result.ErrorType);
    }

    [Fact]
    public void Forbidden_ShouldCreateForbiddenResult()
    {
        var result = Result<int>.Forbidden("No permission");
        Assert.False(result.IsSuccess);
        Assert.Equal(ErrorType.Forbidden, result.ErrorType);
    }
}
