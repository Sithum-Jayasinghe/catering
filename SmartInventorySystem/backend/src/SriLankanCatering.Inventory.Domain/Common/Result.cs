namespace SriLankanCatering.Inventory.Domain.Common;

public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Data { get; }
    public string Error { get; } = string.Empty;
    public List<string> Errors { get; } = [];
    public ErrorType ErrorType { get; }

    protected Result(bool isSuccess, T? data, string error, ErrorType errorType)
    {
        IsSuccess = isSuccess;
        Data = data;
        Error = error;
        ErrorType = errorType;
    }

    public static Result<T> Success(T data) => new(true, data, string.Empty, ErrorType.None);
    public static Result<T> Failure(string error, ErrorType errorType = ErrorType.Validation) => new(false, default, error, errorType);
    public static Result<T> NotFound(string error) => new(false, default, error, ErrorType.NotFound);
    public static Result<T> Conflict(string error) => new(false, default, error, ErrorType.Conflict);
    public static Result<T> Forbidden(string error) => new(false, default, error, ErrorType.Forbidden);
}

public enum ErrorType
{
    None,
    Validation,
    NotFound,
    Conflict,
    Forbidden,
    BadRequest,
    InternalServerError,
    Database
}
