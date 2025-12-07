
namespace OrderMS.Application.Dtos.Products.Requests;

public record OrderProductRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}
