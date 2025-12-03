
using OrderMS.Domain.Enums;

namespace OrderMS.Application.Dtos.Orders.Responses;

public class OrderDto
{
    public Guid Id { get; set; }
    public string? CustomerName { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }
    public int TotalItems { get; set; }
}