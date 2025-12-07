using FluentValidation;
using MediatR;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Services;

namespace OrderMS.Application.Features.Products.Commands.Delete;

public record DeleteProductCommand(Guid Id) : IRequest<ApiResponse<string>>;
public class DeleteProductCommandHandler(IProductRepository productRepository) : IRequestHandler<DeleteProductCommand, ApiResponse<string>>
{
    private readonly IProductRepository _productRepository = productRepository;

    public async Task<ApiResponse<string>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<string> apiResponse = new();

        if (request.Id == Guid.Empty)
        {

        }

        var product = await _productRepository.GetByIdAsync(request.Id) ??
                                throw new ValidationException("Product doesn't exist");

        if (product is null)
        {
            throw new ValidationException("Product doesn't exist");
        }

        _productRepository.Delete(product);

        if (await _productRepository.SaveChangesAsync(cancellationToken) > 0)
        {
            apiResponse.Success = true;
            apiResponse.Data = "Operation Succeeded!";
            apiResponse.Message = "Product Deleted successfully!";
        }

        return apiResponse;
    }
}