using MediatR;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Services;

namespace OrderMS.Application.Features.Users.Queries;

public record GetUserByIdQuery(Guid Id) : IRequest<UserDto?>;
public class GetUserByIdQueryHandler(IIdentityService identityService) : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    private readonly IIdentityService _identityService = identityService;

    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {

        var user = await _identityService.GetByIdAsync(request.Id);
        var userDto = user?.MapTo<UserDto>();

        return userDto;
    }
}