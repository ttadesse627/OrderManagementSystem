using FluentValidation;
using MediatR;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Products.Requests;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Enums;

namespace OrderMS.Application.Features.Orders.Commands;

public record CreateOrderCommand(List<OrderProductRequest> Products) : IRequest<ApiResponse<Guid>>;
public class CreateOrderCommandHandler(
                                        IOrderRepository orderRepository,
                                        IProductRepository ProductRepository, IUserResolverService userResolverService,
                                        ICustomerRepository customerRepository
                                    ) : IRequestHandler<CreateOrderCommand, ApiResponse<Guid>>
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly IProductRepository _ProductRepository = ProductRepository;
    private readonly ICustomerRepository _customerRepository = customerRepository;
    private readonly IUserResolverService _userResolverService = userResolverService;

    public async Task<ApiResponse<Guid>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<Guid> response = new();

        if (request.Products.Count == 0)
        {
            throw new ApplicationException("No Products are specified.");
        }

        HashSet<Guid> ProductIds = [.. request.Products.Select(i => i.ProductId).Distinct()];
        var dbProducts = await _ProductRepository.GetFilteredValuesAsync(i => request.Products.Select(it => it.ProductId).Contains(i.Id));

        if (dbProducts.Count != request.Products.Count)
        {
            throw new InvalidOperationException("One or more Products in the order request are invalid.");
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

        var orderProducts = new List<OrderProduct>();
        decimal totalAmount = 0;

        foreach (var requestedProductDto in request.Products)
        {
            var ProductDetails = dbProducts.First(i => i.Id == requestedProductDto.ProductId);

            if (ProductDetails.StockQuantity < requestedProductDto.Quantity)
            {
                throw new InvalidOperationException($"Insufficient stock for Product {ProductDetails.Name}");
            }

            decimal ProductCost = ProductDetails.Price * requestedProductDto.Quantity;
            totalAmount += ProductCost;

            orderProducts.Add(new OrderProduct
            {
                OrderId = newOrder.Id,
                ProductId = requestedProductDto.ProductId,
                ProductQuantity = requestedProductDto.Quantity
            });

            // Deduct stock quantity
            ProductDetails.StockQuantity -= requestedProductDto.Quantity;
        }

        newOrder.TotalAmount = totalAmount;
        newOrder.Products = orderProducts;

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

