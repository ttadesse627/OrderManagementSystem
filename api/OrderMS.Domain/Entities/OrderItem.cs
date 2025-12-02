

namespace OrderMS.Domain.Entities;

public class OrderItem
{
    public Guid OrderId { get; set; }
    public Guid ItemId { get; set; }
    public int ItemQuantity { get; set; }
}