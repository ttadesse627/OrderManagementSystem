using FluentValidation;
using MediatR;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Services;

namespace OrderMS.Application.Features.Items.Commands.Delete;

public record DeleteItemCommand(Guid Id) : IRequest<ApiResponse<string>>;
public class DeleteItemCommandHandler(IItemRepository itemRepository) : IRequestHandler<DeleteItemCommand, ApiResponse<string>>
{
    private readonly IItemRepository _itemRepository = itemRepository;

    public async Task<ApiResponse<string>> Handle(DeleteItemCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<string> apiResponse = new();

        if (request.Id == Guid.Empty)
        {

        }

        var item = await _itemRepository.GetByIdAsync(request.Id) ??
                                throw new ValidationException("Item doesn't exist");

        if (item is null)
        {
            throw new ValidationException("Item doesn't exist");
        }

        _itemRepository.Delete(item);

        if (await _itemRepository.SaveChangesAsync(cancellationToken) > 0)
        {
            apiResponse.Success = true;
            apiResponse.Data = "Operation Succeeded!";
            apiResponse.Message = "Item Deleted successfully!";
        }

        return apiResponse;
    }
}