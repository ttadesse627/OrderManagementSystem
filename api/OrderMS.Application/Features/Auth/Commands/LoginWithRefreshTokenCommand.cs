using MediatR;
using Microsoft.Extensions.DependencyInjection;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Auth.Commands;

public record LoginWithRefreshTokenCommand(string RefreshToken) : IRequest<AuthResponse>;
public class LoginWithRefreshTokenCommandHandler(
                                IUserResolverService userResolverService,
                                IIdentityService identityService,
                                ITokenGeneratorService tokenGeneratorService,
                                ITokenRepository tokenRepository,
                                IServiceProvider serviceProvider,
                                IBackgroundTaskQueue taskQueue) : IRequestHandler<LoginWithRefreshTokenCommand, AuthResponse>
{
    private readonly IUserResolverService _userResolverService = userResolverService;
    private readonly IIdentityService _identityService = identityService;
    private readonly ITokenGeneratorService _tokenGeneratorService = tokenGeneratorService;
    private readonly ITokenRepository _tokenRepository = tokenRepository;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly IBackgroundTaskQueue _taskQueue = taskQueue;

    public async Task<AuthResponse> Handle(LoginWithRefreshTokenCommand request, CancellationToken cancellationToken)
    {

        if (string.IsNullOrEmpty(request.RefreshToken))
        {
            throw new ArgumentNullException(request.RefreshToken, nameof(request.RefreshToken));
        }

        var existingToken = await _tokenRepository.GetRefreshTokenAsync(request.RefreshToken);
        if (existingToken == null || existingToken.Expires < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        var user = await _identityService.GetByIdAsync(existingToken.UserId);

        var token = await _tokenGeneratorService.GenerateTokenAsync(user ?? throw new UnauthorizedAccessException("This user is not authorized yet."));
        var refreshToken = _tokenGeneratorService.GenerateRefreshToken();

        AuthResponse authResponse = new()
        {
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Token = token,
            RefreshToken = refreshToken
        };

        // Save refresh token in background
        _taskQueue.QueueBackgroundTaskItem(async cancellationToken =>
        {
            var repository = _serviceProvider.GetRequiredService<ITokenRepository>();

            await _tokenRepository.RemoveTokensAsync(user.Id, cancellationToken);
            RefreshToken refToken = new()
            {
                Token = refreshToken,
                UserId = user.Id,
                Expires = DateTime.UtcNow.AddDays(3),
            };

            await _tokenRepository.SaveTokenAsync(refToken, user.Id, cancellationToken);
        });

        return await Task.FromResult(authResponse);
    }
}