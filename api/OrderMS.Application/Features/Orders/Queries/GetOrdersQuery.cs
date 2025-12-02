using MediatR;
using OrderMS.Application.Dtos.Categories.Responses;
using OrderMS.Application.Services;

namespace OrderMS.Application.Features.Orders.Queries;

public record GetOrdersQuery : IRequest<List<OrderDto>>;
public class GetOrdersQueryHandler(IOrderRepository orderRepository) : IRequestHandler<GetOrdersQuery, List<OrderDto>>
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    public async Task<List<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await _orderRepository.GetAllAsync();
        var responseOrders = orders.Select(order =>
        {
            return new OrderDto
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount
            };
        });

        return [.. responseOrders];
    }
}