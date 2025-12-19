using MediatR;
using OrderMS.Application.AppServices.Interfaces;

namespace OrderMS.Application.Features.Auth.Commands;

public record LogoutCommand() : IRequest;
public class LogoutCommandHandler(IUserResolverService userResolverService, ITokenRepository tokenRepository) : IRequestHandler<LogoutCommand>
{
    private readonly IUserResolverService _userResolverService = userResolverService;
    private readonly ITokenRepository _tokenRepository = tokenRepository;

    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var userId = _userResolverService.GetUserId();
        if (userId == Guid.Empty) throw new UnauthorizedAccessException("You are not authorized yet");

        await _tokenRepository.RemoveTokensAsync(userId, cancellationToken);

        var jti = _userResolverService.GetTokenId();
        if (!string.IsNullOrEmpty(jti))
        {
            // calculate time until token expiry:
            var expString = _userResolverService.GetTokenExpirationTime();
            if (long.TryParse(expString, out var exp))
            {
                var expiry = DateTimeOffset.FromUnixTimeSeconds(exp)
                                .UtcDateTime - DateTime.UtcNow;
                await _tokenRepository.RevokeTokensAsync(jti, expiry);
            }
        }
    }
}