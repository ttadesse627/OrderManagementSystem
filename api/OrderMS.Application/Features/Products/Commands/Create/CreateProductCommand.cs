using FluentValidation;
using MediatR;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Products.Requests;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Products.Commands.Create;

public record CreateProductCommand(ProductRequest ProductRequest) : IRequest<ApiResponse<Guid>>;
public class CreateProductCommandHandler(IProductRepository productRepository, IFileService fileService, IBackgroundTaskQueue queue) : IRequestHandler<CreateProductCommand, ApiResponse<Guid>>
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IBackgroundTaskQueue _queue = queue;
    private readonly IFileService _fileService = fileService;
    public async Task<ApiResponse<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var productValidator = new CreateProductCommandValidator();
        ApiResponse<Guid> response = new();

        var validationResult = await productValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ApplicationException(string.Join(";", validationResult.Errors.Select(er => er.ErrorMessage)));
        }

        var (succes, errorMessage) = request.ProductRequest.ProductImage == null ? (false, string.Empty) :
            _fileService.IsValid(request.ProductRequest.ProductImage);

        var product = new Product
        {
            Name = request.ProductRequest.Name,
            Price = request.ProductRequest.Price,
            StockQuantity = request.ProductRequest.StockQuantity,
            CategoryId = request.ProductRequest.CategoryId
        };
        _productRepository.Add(product);
        var createResult = await _productRepository.SaveChangesAsync(cancellationToken);
        if (createResult > 0)
        {
            if (succes)
            {
                string fileName = await _fileService.UploadAsync(request.ProductRequest.ProductImage!, product.Id);

                if (fileName is not null)
                {
                    product.ImageUrl = fileName;
                    await _productRepository.SaveChangesAsync(cancellationToken);
                }
                // _ = Task.Run(async () =>
                // {
                //     await _fileService.UploadAsync(request.ProductRequest.ProductImage!, Product.Id);
                // }, cancellationToken);
            }

            else
            {
                throw new ValidationException(string.Join(";", validationResult.Errors.Select(er => er.ErrorMessage)));
            }

            // Save file in background
            // _queue.QueueBackgroundTaskProduct(async cancellationToken =>
            // {
            //     await _fileService.UploadAsync(request.ProductRequest.ProductImage!, Product.Id);
            // });

            response.Data = product.Id;
            response.Success = true;
            response.Message = "Product created successfully.";
        }

        return await Task.FromResult(response);
    }
}