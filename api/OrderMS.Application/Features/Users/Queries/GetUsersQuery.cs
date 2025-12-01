using MediatR;
using OrderMS.Application.Dtos.Items.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application.Features.Users.Queries;

public record GetUsersQuery(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false) : IRequest<PaginatedResult<ItemDto>>;
public class GetUsersQueryHandler(IItemRepository itemRepository) : IRequestHandler<GetUsersQuery, PaginatedResult<ItemDto>>
{
    private readonly IItemRepository _itemRepository = itemRepository;

    public async Task<PaginatedResult<ItemDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {

        var paginatedUsers = await _itemRepository.GetPaginatedAsync(
            request.pageNumber,
            request.pageSize,
            request.sortBy,
            request.sortDescending
        );
        var usersDto = paginatedUsers.Items.MapTo<List<ItemDto>>();

        return new PaginatedResult<ItemDto>
        {
            PageNumber = paginatedUsers.PageNumber,
            PageSize = paginatedUsers.PageSize,
            TotalCount = paginatedUsers.TotalCount,
            Items = usersDto
        };
    }
}