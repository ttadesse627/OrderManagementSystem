

namespace OrderMS.Application.Dtos.Requests;

public record ItemRequest
{
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public Guid CategoryId { get; set; }
};