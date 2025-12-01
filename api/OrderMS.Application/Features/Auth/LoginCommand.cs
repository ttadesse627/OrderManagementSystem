using MediatR;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Services;

namespace OrderMS.Application.Features.Users.Commands;

public record LoginCommand(LoginRequest Request) : IRequest<AuthResponse>;
public class LoginCommandHandler(IIdentityService identityService, ITokenGeneratorService tokenGeneratorService) : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IIdentityService _identityService = identityService;
    private readonly ITokenGeneratorService _tokenGeneratorService = tokenGeneratorService;
    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var authResponse = new AuthResponse();

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

        authResponse.UserId = user.Id;
        authResponse.Email = user.Email ?? string.Empty;
        authResponse.FirstName = user.FirstName;
        authResponse.LastName = user.LastName;
        authResponse.Token = token;

        return await Task.FromResult(authResponse);
    }
}