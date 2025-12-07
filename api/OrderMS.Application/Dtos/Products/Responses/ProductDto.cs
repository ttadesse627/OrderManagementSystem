using Microsoft.AspNetCore.Http;
using OrderMS.Application.Dtos.Categories.Responses;

namespace OrderMS.Application.Dtos.Products.Responses;

public record ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0;
    public int StockQuantity { get; set; }
    public CategoryDto? Category { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

