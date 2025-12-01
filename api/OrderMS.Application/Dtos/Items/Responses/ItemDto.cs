using OrderMS.Application.Dtos.Categories.Responses;

namespace OrderMS.Application.Dtos.Items.Responses;

public record ItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0;
    public int StockQuantity { get; set; }
    public CategoryDto? Category { get; set; }
}

