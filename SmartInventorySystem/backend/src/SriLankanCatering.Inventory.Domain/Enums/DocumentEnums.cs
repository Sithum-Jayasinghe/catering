namespace SriLankanCatering.Inventory.Domain.Enums;

public enum PurchaseOrderStatus
{
    Draft = 1,
    PendingApproval = 2,
    Approved = 3,
    Sent = 4,
    PartiallyReceived = 5,
    Received = 6,
    Cancelled = 7,
    Rejected = 8
}

public enum GoodsReceivedNoteStatus
{
    Draft = 1,
    PendingVerification = 2,
    Verified = 3,
    PartiallyAccepted = 4,
    Accepted = 5,
    Rejected = 6,
    PartiallyReturned = 7
}

public enum GoodsIssueStatus
{
    Draft = 1,
    PendingApproval = 2,
    Approved = 3,
    Issued = 4,
    Cancelled = 5
}

public enum StockTransferStatus
{
    Draft = 1,
    PendingApproval = 2,
    InTransit = 3,
    Completed = 4,
    Cancelled = 5,
    PartiallyReceived = 6
}
