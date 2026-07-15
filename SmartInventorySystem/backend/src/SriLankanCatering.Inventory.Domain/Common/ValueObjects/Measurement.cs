namespace SriLankanCatering.Inventory.Domain.Common;

public readonly struct Measurement : IEquatable<Measurement>
{
    public decimal Quantity { get; }
    public string Unit { get; }
    public string? SubUnit { get; }

    public Measurement(decimal quantity, string unit, string? subUnit = null)
    {
        Quantity = quantity;
        Unit = unit;
        SubUnit = subUnit;
    }

    public static Measurement operator +(Measurement a, Measurement b)
    {
        if (!string.Equals(a.Unit, b.Unit, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Cannot add measurements with different units");
        return new Measurement(a.Quantity + b.Quantity, a.Unit, a.SubUnit ?? b.SubUnit);
    }

    public static Measurement operator -(Measurement a, Measurement b)
    {
        if (!string.Equals(a.Unit, b.Unit, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Cannot subtract measurements with different units");
        return new Measurement(a.Quantity - b.Quantity, a.Unit, a.SubUnit ?? b.SubUnit);
    }

    public static bool operator ==(Measurement left, Measurement right) => left.Equals(right);
    public static bool operator !=(Measurement left, Measurement right) => !left.Equals(right);

    public bool Equals(Measurement other) => Quantity == other.Quantity && Unit == other.Unit;
    public override bool Equals(object? obj) => obj is Measurement other && Equals(other);
    public override int GetHashCode() => HashCode.Combine(Quantity, Unit);
    public override string ToString() => $"{Quantity} {Unit}";
}
