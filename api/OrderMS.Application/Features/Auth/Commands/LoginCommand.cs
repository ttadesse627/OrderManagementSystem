using MediatR;
using Microsoft.Extensions.DependencyInjection;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Auth.Commands;

public record LoginCommand(LoginRequest Request) : IRequest<AuthResponse>;
public class LoginCommandHandler(
                                IIdentityService identityService,
                                ITokenGeneratorService tokenGeneratorService,
                                ITokenRepository tokenRepository,
                                IServiceProvider serviceProvider,
                                IBackgroundTaskQueue taskQueue) : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IIdentityService _identityService = identityService;
    private readonly ITokenGeneratorService _tokenGeneratorService = tokenGeneratorService;
    private readonly ITokenRepository _tokenRepository = tokenRepository;
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly IBackgroundTaskQueue _taskQueue = taskQueue;

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.Request.Email))
        {
            throw new ArgumentException("Email cannot be null or empty", nameof(request.Request.Email));
        }

        if (string.IsNullOrEmpty(request.Request.Password))
        {
            throw new ArgumentException("Email cannot be null or empty", nameof(request.Request.Password));
        }
        var isAuthenticated = await _identityService.AuthenticateUserAsync(request.Request.Email, request.Request.Password);
        if (!isAuthenticated)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var user = await _identityService.GetUserByEmailAsync(request.Request.Email);
        if (user == null)
        {
            throw new KeyNotFoundException("Invalid email or password.");
        }

        var token = await _tokenGeneratorService.GenerateTokenAsync(user);
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
            using var scope = _serviceProvider.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<ITokenRepository>();
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