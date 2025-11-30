using MediatR;
using OrderMS.Application.Dtos.Requests;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Users.Commands;

public record CreateUserCommand(RegisterRequest RegisterRequest) : IRequest<AuthResponse>;
public class CreateUserCommandHandler(IIdentityService identityService, ITokenGeneratorService tokenGeneratorService) : IRequestHandler<CreateUserCommand, AuthResponse>
{
    private readonly IIdentityService _identityService = identityService;
    private readonly ITokenGeneratorService _tokenGeneratorService = tokenGeneratorService;
    public async Task<AuthResponse> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var userValidator = new CreateUserCommandValidator();
        var authResponse = new AuthResponse();

        await userValidator.ValidateAsync(request, cancellationToken);
        var user = new ApplicationUser
        {
            FirstName = request.RegisterRequest.FirstName,
            LastName = request.RegisterRequest.LastName,
            Email = request.RegisterRequest.Email,
            UserName = request.RegisterRequest.Email
        };

        var createResult = await _identityService.CreateUserAsync(
            user,
            request.RegisterRequest.Roles,
            request.RegisterRequest.Password
        );

        if (createResult.Success)
        {
            var token = await _tokenGeneratorService.GenerateTokenAsync(user);
            authResponse.UserId = user.Id;
            authResponse.Email = user.Email;
            authResponse.FirstName = user.FirstName;
            authResponse.LastName = user.LastName;
            authResponse.Token = token;
        }
        return await Task.FromResult(authResponse);
    }
}