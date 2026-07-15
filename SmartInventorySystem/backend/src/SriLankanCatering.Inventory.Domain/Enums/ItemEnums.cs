namespace SriLankanCatering.Inventory.Domain.Enums;

public enum ItemCondition
{
    New = 1,
    Good = 2,
    Fair = 3,
    Damaged = 4,
    Expired = 5,
    Recalled = 6
}

public enum QualityGrade
{
    A = 1,
    B = 2,
    C = 3,
    D = 4,
    F = 5
}

public enum StorageType
{
    Ambient = 1,
    Refrigerated = 2,
    Frozen = 3,
    Dry = 4,
    Hazardous = 5,
    Controlled = 6
}

public enum UnitOfMeasure
{
    Piece = 1,
    Kilogram = 2,
    Liter = 3,
    Milliliter = 4,
    Gram = 5,
    Box = 6,
    Carton = 7,
    Packet = 8,
    Bundle = 9,
    Dozen = 10,
    Set = 11,
    Meter = 12,
    Unit = 13,
    Bottle = 14,
    Can = 15,
    Pack = 16
}

public enum TemperatureZone
{
    Ambient = 1,
    Chilled = 2,
    Frozen = 3,
    DeepFrozen = 4
}
