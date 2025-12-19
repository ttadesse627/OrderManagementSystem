


namespace OrderMS.Domain.Entities;

public class FileName
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public string? EntityType { get; set; }
}