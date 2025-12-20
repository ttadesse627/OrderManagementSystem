using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Products.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application.Features.Products.Queries;

public record GetProductsQuery(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false) : IRequest<PaginatedResult<ProductDto>>;
public class GetProductsQueryHandler(IProductRepository productRepository, IFileRepository fileRepository) : IRequestHandler<GetProductsQuery, PaginatedResult<ProductDto>>
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IFileRepository _fileRepository = fileRepository;

    public async Task<PaginatedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {

        var paginatedProducts = await _productRepository.GetPaginatedAsync(
            request.pageNumber,
            request.pageSize,
            request.sortBy,
            request.sortDescending
        );

        var dtoProducts = paginatedProducts.Items.Select(product => new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Category = product.Category?.Name,
            }).ToList();

            foreach (var product in dtoProducts)
            {
                product.ImageUrl = await _fileRepository.GetProductImageUrlAsync(product.Id);
            }

        return new PaginatedResult<ProductDto>
        {
            PageNumber = paginatedProducts.PageNumber,
            PageSize = paginatedProducts.PageSize,
            TotalCount = paginatedProducts.TotalCount,
            Items = dtoProducts
        };
    }
}