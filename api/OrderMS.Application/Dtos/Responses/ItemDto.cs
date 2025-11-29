
namespace OrderMS.Application.Dtos.Responses;

public record ItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0;
    public int StockQuantity { get; set; }
    public CategoryDto? Category { get; set; }
}

public record CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}