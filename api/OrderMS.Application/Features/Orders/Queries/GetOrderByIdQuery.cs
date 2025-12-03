using FluentValidation;
using MediatR;
using OrderMS.Application.Dtos.Customers.Responses;
using OrderMS.Application.Dtos.Items.Requests;
using OrderMS.Application.Dtos.Items.Responses;
using OrderMS.Application.Dtos.Orders.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Orders.Queries;

public record GetOrderByIdQuery(Guid Id) : IRequest<OrderDetailsDto>;
public class GetOrderByIdQueryHandler(IOrderRepository orderRepository, ICustomerRepository customerRepository) : IRequestHandler<GetOrderByIdQuery, OrderDetailsDto>
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly ICustomerRepository _customerRepository = customerRepository;

    public async Task<OrderDetailsDto> Handle(GetOrderByIdQuery query, CancellationToken cancellationToken)
    {
        var order = (query.Id != Guid.Empty ? await _orderRepository.GetByIdAsync(query.Id)
                    : throw new ValidationException($"{nameof(query.Id)} is not provided.")) ??
                throw new KeyNotFoundException("Requested item does not found");

        var customer = await _customerRepository.GetByIdAsync(order.CustomerId);

        return new OrderDetailsDto
        {
            Id = order.Id,
            Customer = new CustomerDto
            {
                Id = customer!.Id,
                Name = string.Join("", [order.Customer.User.FirstName, order.Customer.User.LastName]),
                Address = customer.User.Address,
                Email = customer.User.Email
            },
            OrderDate = order.OrderDate,
            Status = order.Status,
            Items = [.. order.Items.Select(i =>
                        new OrderedItem
                        {
                            Item = new ItemDto
                            {
                                Id = i.ItemId,
                                Name = i.Item.Name,
                                Price = i.Item.Price
                            }
                        }
                    )]
        };

    }
}