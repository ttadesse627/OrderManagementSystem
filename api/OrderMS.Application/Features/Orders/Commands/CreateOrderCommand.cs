using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Orders.Responses;
using OrderMS.Application.Dtos.Products.Requests;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Enums;

namespace OrderMS.Application.Features.Orders.Commands;

public record CreateOrderCommand(List<OrderItemRequest> Items) : IRequest<ApiResponse<CreateOrderResponse>>;
public class CreateOrderCommandHandler(
                                        IOrderRepository orderRepository,
                                        IProductRepository productRepository, IUserResolverService userResolverService,
                                        ICustomerRepository customerRepository,
                                        IOrderCalculationService calculationService
                                    ) : IRequestHandler<CreateOrderCommand, ApiResponse<CreateOrderResponse>>
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly IProductRepository _productRepository = productRepository;
    private readonly ICustomerRepository _customerRepository = customerRepository;
    private readonly IOrderCalculationService _calculationService = calculationService;
    private readonly IUserResolverService _userResolverService = userResolverService;

    public async Task<ApiResponse<CreateOrderResponse>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var createOrderValidator = new CreateOrderCommandValidator();
        var validationResult = createOrderValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.Result.IsValid)
        {
            throw new ValidationException(validationResult.Result.Errors);
        }

        var productIds = request.Items.Select(p => p.ProductId).Distinct().ToList();
        var dbProducts = await _productRepository.GetFilteredForUpdateAsync(p => productIds.Contains(p.Id));

        if (dbProducts.Count != productIds.Count)
            throw new InvalidOperationException("One or more products are invalid.");

        var userId = _userResolverService.GetUserId();
        if (userId == Guid.Empty)
            throw new UnauthorizedAccessException("You are an Authorized person!");

        var customer = (await _customerRepository
            .GetFilteredValuesAsync(c => c.UserId == userId))
            .First();

        var order = new Order
        {
            CustomerId = customer.Id,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Ordered
        };

        var orderItems = new List<OrderItem>();
        var calculationInput = new List<(decimal price, decimal taxRate, int quantity)>();

        foreach (var req in request.Items)
        {
            var product = dbProducts.First(p => p.Id == req.ProductId);

            if (product.StockQuantity < req.Quantity)
                throw new InvalidOperationException($"Insufficient stock for {product.Name}");

            calculationInput.Add((product.Price, product.TaxRate, req.Quantity));

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductQuantity = req.Quantity
            });

            product.StockQuantity -= req.Quantity;
        }

        order.Items = orderItems;
        order.GrandTotal = _calculationService.CalculateOrderGrandTotal(calculationInput);

        _orderRepository.Add(order);
        try
        {
            await _orderRepository.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException updateException)
        {
            throw new InvalidOperationException("Failed to update order due to concurrency issues. Please try again.", updateException);
        }

        return new ApiResponse<CreateOrderResponse>
        {
            Data = new CreateOrderResponse
            {
                OrderId = order.Id,
                TotalPayment = order.GrandTotal,
                Status = order.Status
            },
            Success = true,
            Message = "Order created successfully."
        };
    }

}

