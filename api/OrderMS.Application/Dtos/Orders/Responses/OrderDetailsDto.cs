

using OrderMS.Application.Dtos.Customers.Responses;
using OrderMS.Application.Dtos.Items.Requests;
using OrderMS.Domain.Enums;

namespace OrderMS.Application.Dtos.Orders.Responses;

public class OrderDetailsDto
{
    public Guid Id { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public CustomerDto? Customer { get; set; }
    public ICollection<OrderedItem> Items { get; set; } = [];
}