
namespace OrderMS.Application.Dtos.Products.Requests;

public record OrderItemRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}
