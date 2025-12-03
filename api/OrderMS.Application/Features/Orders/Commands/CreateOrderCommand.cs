using FluentValidation;
using MediatR;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Items.Requests;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Enums;

namespace OrderMS.Application.Features.Orders.Commands;

public record CreateOrderCommand(List<OrderItemRequest> Items) : IRequest<ApiResponse<Guid>>;
public class CreateOrderCommandHandler(
                                        IOrderRepository orderRepository,
                                        IItemRepository itemRepository, IUserResolverService userResolverService,
                                        ICustomerRepository customerRepository
                                    ) : IRequestHandler<CreateOrderCommand, ApiResponse<Guid>>
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly IItemRepository _itemRepository = itemRepository;
    private readonly ICustomerRepository _customerRepository = customerRepository;
    private readonly IUserResolverService _userResolverService = userResolverService;

    public async Task<ApiResponse<Guid>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<Guid> response = new();

        if (request.Items.Count == 0)
        {
            throw new ApplicationException("No items are specified.");
        }

        HashSet<Guid> itemIds = [.. request.Items.Select(i => i.ItemId).Distinct()];
        var dbItems = await _itemRepository.GetFilteredValuesAsync(i => request.Items.Select(it => it.ItemId).Contains(i.Id));

        if (dbItems.Count != request.Items.Count)
        {
            throw new InvalidOperationException("One or more items in the order request are invalid.");
        }

        var userId = _userResolverService.GetUserId();

        if (userId == Guid.Empty)
        {
            throw new ValidationException("You are an Authorized person!");
        }
        var customer = await _customerRepository.GetFilteredValuesAsync(cust => cust.UserId == userId);

        var newOrder = new Order
        {
            CustomerId = customer.First().Id,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Ordered,
            TotalAmount = 0
        };

        var orderItems = new List<OrderItem>();
        decimal totalAmount = 0;

        foreach (var requestedItemDto in request.Items)
        {
            var itemDetails = dbItems.First(i => i.Id == requestedItemDto.ItemId);

            if (itemDetails.StockQuantity < requestedItemDto.Quantity)
            {
                throw new InvalidOperationException($"Insufficient stock for Item {itemDetails.Name}");
            }

            decimal itemCost = itemDetails.Price * requestedItemDto.Quantity;
            totalAmount += itemCost;

            orderItems.Add(new OrderItem
            {
                OrderId = newOrder.Id,
                ItemId = requestedItemDto.ItemId,
                ItemQuantity = requestedItemDto.Quantity
            });

            // Deduct stock quantity
            itemDetails.StockQuantity -= requestedItemDto.Quantity;
        }

        newOrder.TotalAmount = totalAmount;
        newOrder.Items = orderItems;

        _orderRepository.Add(newOrder);
        var result = await _orderRepository.SaveChangesAsync(cancellationToken);

        if (result > 0)
        {
            response.Data = newOrder.Id;
            response.Success = true;
            response.Message = "Order created successfully.";
        }

        return await Task.FromResult(response);
    }
}

