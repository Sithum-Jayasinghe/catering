namespace SriLankanCatering.Inventory.Domain.Entities;

public class AiKnowledgeBase : BaseEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string DocumentType { get; set; }
    public required string StoragePath { get; set; }
    public string? FileExtension { get; set; }
    public long FileSize { get; set; }
    public string? MimeType { get; set; }
    public required string DocumentCategory { get; set; }
    public bool IsIndexed { get; set; } = false;
    public DateTime? IndexedAt { get; set; }
    public string? ExtractedText { get; set; }
    public string? VectorEmbeddingBlob { get; set; }
    public required string[] Tags { get; set; } = [];
    public string? Keywords { get; set; }
    public string? Language { get; set; } = "en";
    public int? SemanticVersion { get; set; } = 1;
    public DateTime? LastAccessed { get; set; }
    public string? AccessRestrictions { get; set; }
}
