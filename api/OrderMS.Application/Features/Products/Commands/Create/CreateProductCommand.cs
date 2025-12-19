using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Products.Requests;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Products.Commands.Create;

public record CreateProductCommand(ProductRequest ProductRequest) : IRequest<ApiResponse<Guid>>;
public class CreateProductCommandHandler(
                    IProductRepository productRepository,
                    IFileService fileService,
                    IFileRepository fileRepository) : IRequestHandler<CreateProductCommand, ApiResponse<Guid>>
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IFileService _fileService = fileService;
    private readonly IFileRepository _fileRepository = fileRepository;

    public async Task<ApiResponse<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var productValidator = new CreateProductCommandValidator();
        ApiResponse<Guid> response = new();

        var validationResult = await productValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ApplicationException(string.Join(";", validationResult.Errors.Select(er => er.ErrorMessage)));
        }

        List<IFormFile> validImages = request.ProductRequest.ProductImages
                                        .Where(img => _fileService.IsValid(img).Success)
                                        .ToList();

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.ProductRequest.Name,
            Price = request.ProductRequest.Price,
            StockQuantity = request.ProductRequest.StockQuantity,
            CategoryId = request.ProductRequest.CategoryId
        };

        _productRepository.Add(product);


        IList<string> fileNames = await _fileService.UploadFilesAsync(validImages, product.Id);
        IList<FileName> files = [];

        foreach (var fileName in fileNames)
        {
            FileName file = new()
            {
                Name = fileName,
                EntityType = nameof(Product)
            };
            files.Add(file);
        }

        await _fileRepository.AddAsync(files);

        var createResult = await _productRepository.SaveChangesAsync(cancellationToken);
        response.Data = product.Id;
        response.Success = true;
        response.Message = "Product created successfully.";

        return await Task.FromResult(response);
    }
}