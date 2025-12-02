

using OrderMS.Application.Dtos.Items.Requests;
using OrderMS.Domain.Enums;

public class OrderDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public ICollection<OrderedItem> Items { get; set; } = [];
}