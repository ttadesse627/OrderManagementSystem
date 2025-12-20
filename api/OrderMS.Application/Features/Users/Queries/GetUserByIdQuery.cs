using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Users.Responses;

namespace OrderMS.Application.Features.Users.Queries;

public record GetUserByIdQuery(Guid Id) : IRequest<UserDetailDto?>;
public class GetUserByIdQueryHandler(IIdentityService identityService) : IRequestHandler<GetUserByIdQuery, UserDetailDto?>
{
    private readonly IIdentityService _identityService = identityService;

    public async Task<UserDetailDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {

        var user = await _identityService.GetByIdAsync(request.Id) ??
                    throw new KeyNotFoundException("This user does not exist.");

        IReadOnlyList<string> userRoles = user is not null ? await _identityService.GetUserRolesAsync(user) : [];

        var userDto = user?.MapTo<UserDetailDto>();

        if (userDto is not null) userDto.Roles = [.. userRoles];

        return userDto;
    }
}