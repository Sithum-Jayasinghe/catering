namespace SriLankanCatering.Inventory.Domain.Enums;

public enum NotificationType
{
    LowStock = 1,
    ExpiryWarning = 2,
    Expired = 3,
    DamagedItem = 4,
    PurchaseOrderApproval = 5,
    GoodsReceived = 6,
    GoodsIssue = 7,
    StockTransfer = 8,
    PaymentDue = 9,
    SystemAlert = 10,
    AuditLog = 11,
    AiRecommendation = 12,
    SupplierDelay = 13,
    QualityAlert = 14,
    ReorderSuggestion = 15
}

public enum NotificationChannel
{
    InApp = 1,
    Email = 2,
    SMS = 3,
    MicrosoftTeams = 4,
    PushNotification = 5,
    SharePoint = 6
}

public enum NotificationPriority
{
    Low = 1,
    Normal = 2,
    High = 3,
    Urgent = 4,
    Critical = 5
}

public enum AiAgentType
{
    InventoryAgent = 1,
    ProcurementAgent = 2,
    SupplierAgent = 3,
    ExpiryAgent = 4,
    KitchenAgent = 5,
    ForecastAgent = 6,
    ReportingAgent = 7,
    FinanceAgent = 8,
    QualityAssuranceAgent = 9,
    NotificationAgent = 10
}

public enum AiTaskStatus
{
    Pending = 1,
    Running = 2,
    Completed = 3,
    Failed = 4,
    Cancelled = 5,
    PartialSuccess = 6
}

public enum MCPToolType
{
    SqlQuery = 1,
    DocumentSearch = 2,
    EmailSend = 3,
    SharepointQuery = 4,
    TeamsMessage = 5,
    BarcodeScan = 6,
    QrCodeScan = 7,
    FileStorage = 8,
    ExternalApiCall = 9,
    ReportGeneration = 10
}
