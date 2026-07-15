using System.Globalization;

namespace SriLankanCatering.Inventory.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException()
    {
    }

    public DomainException(string message) : base(message)
    {
    }

    public DomainException(string message, Exception innerException) : base(message, innerException)
    {
    }
}

public class NotFoundException : DomainException
{
    public NotFoundException()
    {
    }

    public NotFoundException(string message) : base(message)
    {
    }

    public NotFoundException(string name, object key) : base($"{name} with key {key} was not found.")
    {
    }
}

public class ValidationException : DomainException
{
    public List<string> ValidationErrors { get; } = new List<string>();

    public ValidationException(string message) : base(message)
    {
        ValidationErrors.Add(message);
    }

    public ValidationException(List<string> errors) : base("Validation failed.")
    {
        ValidationErrors = errors;
    }
}

public class ForbiddenException : DomainException
{
    public ForbiddenException() : base("You do not have permission to perform this action.")
    {
    }
}

public class ConflictException : DomainException
{
    public ConflictException(string message) : base(message)
    {
    }
}

public class DomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}
