using MediatR;
using OrderMS.Application.Dtos.Items.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application.Features.Items.Queries;

public record GetItemsQuery(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false) : IRequest<PaginatedResult<ItemDto>>;
public class GetItemsQueryHandler(IItemRepository itemRepository) : IRequestHandler<GetItemsQuery, PaginatedResult<ItemDto>>
{
    private readonly IItemRepository _itemRepository = itemRepository;

    public async Task<PaginatedResult<ItemDto>> Handle(GetItemsQuery request, CancellationToken cancellationToken)
    {

        var paginatedItems = await _itemRepository.GetPaginatedAsync(
            request.pageNumber,
            request.pageSize,
            request.sortBy,
            request.sortDescending
        );
        var dtoItems = paginatedItems.Items.MapTo<List<ItemDto>>();

        return new PaginatedResult<ItemDto>
        {
            PageNumber = paginatedItems.PageNumber,
            PageSize = paginatedItems.PageSize,
            TotalCount = paginatedItems.TotalCount,
            Items = dtoItems
        };
    }
}