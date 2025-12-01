using FluentValidation;
using MediatR;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Items.Requests;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Items.Commands;

public record CreateItemCommand(ItemRequest ItemRequest) : IRequest<ApiResponse<Guid>>;
public class CreateItemCommandHandler(IItemRepository itemRepository, IFileService fileService, IBackgroundTaskQueue queue) : IRequestHandler<CreateItemCommand, ApiResponse<Guid>>
{
    private readonly IItemRepository _itemRepository = itemRepository;
    private readonly IBackgroundTaskQueue _queue = queue;
    private readonly IFileService _fileService = fileService;
    public async Task<ApiResponse<Guid>> Handle(CreateItemCommand request, CancellationToken cancellationToken)
    {
        var itemValidator = new CreateItemCommandValidator();
        ApiResponse<Guid> response = new();

        var validationResult = await itemValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ApplicationException(string.Join(";", validationResult.Errors.Select(er => er.ErrorMessage)));
        }

        var (succes, errorMessage) = request.ItemRequest.ItemImage == null ? (false, string.Empty) :
            _fileService.IsValid(request.ItemRequest.ItemImage);

        var item = new Item
        {
            Name = request.ItemRequest.Name,
            Price = request.ItemRequest.Price,
            StockQuantity = request.ItemRequest.StockQuantity,
            CategoryId = request.ItemRequest.CategoryId
        };
        _itemRepository.Add(item);
        var createResult = await _itemRepository.SaveChangesAsync(cancellationToken);
        if (createResult > 0)
        {
            response.Data = item.Id;
            response.Success = true;
            response.Message = "Item created successfully.";

            if (succes)
            {
                await _fileService.UploadAsync(request.ItemRequest.ItemImage!, item.Id);
                // _ = Task.Run(async () =>
                // {
                //     await _fileService.UploadAsync(request.ItemRequest.ItemImage!, item.Id);
                // }, cancellationToken);
            }

            else
            {
                throw new ValidationException(string.Join(";", validationResult.Errors.Select(er => er.ErrorMessage)));
            }

            // Save file in background
            // _queue.QueueBackgroundTaskItem(async cancellationToken =>
            // {
            //     await _fileService.UploadAsync(request.ItemRequest.ItemImage!, item.Id);
            // });
        }

        return await Task.FromResult(response);
    }
}