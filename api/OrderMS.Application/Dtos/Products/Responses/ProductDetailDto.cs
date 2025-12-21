using OrderMS.Application.Dtos.Categories.Responses;

namespace OrderMS.Application.Dtos.Products.Responses;

public record ProductDetailDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; } = 0;
    public int StockQuantity { get; set; }
    public CategoryDto? Category { get; set; }
    public IReadOnlyList<string> ImageUrls { get; set; } = [];
}

