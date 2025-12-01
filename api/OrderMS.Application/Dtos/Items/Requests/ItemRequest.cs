using Microsoft.AspNetCore.Http;

namespace OrderMS.Application.Dtos.Items.Requests;

public record ItemRequest
{
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public Guid CategoryId { get; set; }
    public IFormFile? ItemImage { get; set; }
};
