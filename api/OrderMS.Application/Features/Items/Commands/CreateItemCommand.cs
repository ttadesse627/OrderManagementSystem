using MediatR;
using OrderMS.Application.Dtos.Requests;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Items.Commands;

public record CreateItemCommand(ItemRequest ItemRequest) : IRequest<ApiResponse<Guid>>;
public class CreateItemCommandHandler(IItemRepository itemRepository) : IRequestHandler<CreateItemCommand, ApiResponse<Guid>>
{
    private readonly IItemRepository _itemRepository = itemRepository;
    public async Task<ApiResponse<Guid>> Handle(CreateItemCommand request, CancellationToken cancellationToken)
    {
        var itemValidator = new CreateItemCommandValidator();
        ApiResponse<Guid> response = new();

        var validationResult = await itemValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ApplicationException(string.Join(";", validationResult.Errors.Select(er => er.ErrorMessage)));
        }
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
            if (createResult > 0)
            {
                response.Data = item.Id;
                response.Success = true;
                response.Message = "Item created successfully.";
            }
        }

        return await Task.FromResult(response);
    }
}