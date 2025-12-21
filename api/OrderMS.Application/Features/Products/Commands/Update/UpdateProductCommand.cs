using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Products.Requests;
using OrderMS.Application.Dtos.Products.Responses;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Products.Commands.Create;

public record UpdateProductCommand(Guid Id, ProductRequest ProductRequest) : IRequest<ApiResponse<ProductDto>>;
public class UpdateProductCommandHandler
                                    (IProductRepository productRepository,
                                    IFileService fileService,
                                    IFileRepository fileRepository) : IRequestHandler<UpdateProductCommand, ApiResponse<ProductDto>>
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IFileService _fileService = fileService;
    private readonly IFileRepository _fileRepository = fileRepository;

    public async Task<ApiResponse<ProductDto>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<ProductDto> response = new();

        Product? existingProduct = await _productRepository.GetForUpdateAsync(request.Id) ??
                                throw new ValidationException("This product doesn't exist.");

        existingProduct.Name = request.ProductRequest.Name;
        existingProduct.Price = request.ProductRequest.Price;
        existingProduct.StockQuantity = request.ProductRequest.StockQuantity;
        existingProduct.CategoryId = request.ProductRequest.CategoryId;
        existingProduct.Name = request.ProductRequest.Name;


        List<IFormFile> validImages = request.ProductRequest.Images
                                       .Where(img => _fileService.IsValid(img).Success)
                                       .ToList();


        IList<FileResource> fileResources = await _fileService.UploadFilesAsync(validImages, existingProduct.Id, nameof(Product));

        if (fileResources.Any())
        {
            await _fileRepository.AddAsync(fileResources);
        }

        await _productRepository.SaveChangesAsync(cancellationToken);

        response.Data = existingProduct.MapTo<ProductDto>();
        response.Success = true;
        response.Message = "Product updated successfully.";


        return await Task.FromResult(response);
    }
}