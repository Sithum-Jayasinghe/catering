namespace SriLankanCatering.Inventory.Domain.Common;

public class Address : IEquatable<Address>
{
    public string StreetAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = "Sri Lanka";

    public Address()
    {
    }

    public Address(string streetAddress, string city, string province, string postalCode, string country = "Sri Lanka")
    {
        StreetAddress = streetAddress;
        City = city;
        Province = province;
        PostalCode = postalCode;
        Country = country;
    }

    public static bool operator ==(Address left, Address right) => left.Equals(right);
    public static bool operator !=(Address left, Address right) => !left.Equals(right);

    public bool Equals(Address other) =>
        StreetAddress == other.StreetAddress && City == other.City &&
        Province == other.Province && PostalCode == other.PostalCode && Country == other.Country;

    public override bool Equals(object? obj) => obj is Address other && Equals(other);
    public override int GetHashCode() => HashCode.Combine(StreetAddress, City, Province, PostalCode, Country);
    public override string ToString() => $"{StreetAddress}, {City}, {Province} {PostalCode}, {Country}";
}
