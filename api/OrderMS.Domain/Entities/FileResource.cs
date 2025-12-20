


namespace OrderMS.Domain.Entities;

public class FileResource : BaseAuditableEntity
{
    public string Name { get; set; } = null!;
    public string EntityType { get; set; } = null!;
    public string? ContentType { get; set; }
    public long Size { get; set; }

}