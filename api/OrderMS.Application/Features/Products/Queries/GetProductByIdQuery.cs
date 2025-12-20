using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Categories.Responses;
using OrderMS.Application.Dtos.Products.Responses;

namespace OrderMS.Application.Features.Products.Queries;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDetailDto>;
public class GetProductByIdQueryHandler(IProductRepository productRepository, IFileRepository fileRepository) : IRequestHandler<GetProductByIdQuery, ProductDetailDto>
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IFileRepository _fileRepository = fileRepository;

    public async Task<ProductDetailDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {

        var product = await _productRepository.GetByIdAsync(request.Id) ??
                    throw new ApplicationException($"Product with Id {request.Id} not found.");

        IReadOnlyList<string> imageUrls = await _fileRepository.GetProductImageUrlsAsync(product.Id);
        return new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Category = product.Category?.MapTo<CategoryDto>(),
            ImageUrls = imageUrls
        };
    }
}