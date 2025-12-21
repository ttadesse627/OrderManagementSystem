using Microsoft.AspNetCore.Http;

namespace OrderMS.Application.Dtos.Products.Requests;

public record ProductRequest
{
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public Guid CategoryId { get; set; }
    public required IList<IFormFile> Images { get; set; } = [];
};
