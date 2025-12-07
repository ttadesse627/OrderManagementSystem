

namespace OrderMS.Domain.Entities;

public class OrderProduct
{
    public Guid OrderId { get; set; }
    public Product Product { get; set; } = null!;
    public Guid ProductId { get; set; }
    public Order Order { get; set; } = null!;
    public int ProductQuantity { get; set; }
}