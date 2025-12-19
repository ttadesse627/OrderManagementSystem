

using OrderMS.Domain.Enums;

namespace OrderMS.Application.Dtos.Orders.Responses;

public record CreateOrderResponse
{
    public Guid OrderId { get; set; }
    public decimal TotalPayment { get; set; }
    public OrderStatus Status { get; set; }
}