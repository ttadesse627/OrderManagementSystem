using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Orders.Responses;

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
                CustomerName = string.Join("", [order.Customer.User.FirstName, order.Customer.User.LastName]),
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalProducts = order.Items.Count
            };
        });

        return [.. responseOrders];
    }
}