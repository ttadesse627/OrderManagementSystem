

namespace OrderMS.Domain.Entities;

public class OrderItem
{
    public Guid OrderId { get; set; }
    public Item Item { get; set; } = null!;
    public Guid ItemId { get; set; }
    public Order Order { get; set; } = null!;
    public int ItemQuantity { get; set; }
}