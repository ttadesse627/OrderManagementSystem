using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Users.Responses;

namespace OrderMS.Application.Features.Users.Queries;

public record GetUserProfileQuery : IRequest<UserProfileDto?>;
public class GetUserProfileQueryHandler(IIdentityService identityService, IUserResolverService userResolverService) : IRequestHandler<GetUserProfileQuery, UserProfileDto?>
{
    private readonly IIdentityService _identityService = identityService;
    private readonly IUserResolverService _userResolverService = userResolverService;

    public async Task<UserProfileDto?> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var currentUserId = _userResolverService.GetUserId();
        var user = await _identityService.GetByIdAsync(currentUserId);
        var userDto = user?.MapTo<UserProfileDto>();

        return userDto;
    }
}