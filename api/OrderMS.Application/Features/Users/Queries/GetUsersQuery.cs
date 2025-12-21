using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application.Features.Users.Queries;

public record GetUsersQuery(
        int currentPage,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false) : IRequest<PaginatedResult<UserDto>>;
public class GetUsersQueryHandler(IIdentityService identityService) : IRequestHandler<GetUsersQuery, PaginatedResult<UserDto>>
{
    private readonly IIdentityService _identityService = identityService;

    public async Task<PaginatedResult<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {

        var paginatedUsers = await _identityService.GetPaginatedAsync(
            request.currentPage,
            request.pageSize,
            request.sortBy,
            request.sortDescending
        );
        var usersDtos = paginatedUsers.Items.MapTo<List<UserDto>>();


        return new PaginatedResult<UserDto>
        {
            CurrentPage = paginatedUsers.CurrentPage,
            PageSize = paginatedUsers.PageSize,
            TotalCount = paginatedUsers.TotalCount,
            Items = usersDtos
        };
    }
}