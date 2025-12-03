using MediatR;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Users.Commands.Create;

public record CreateUserCommand(RegisterRequest RegisterRequest) : IRequest<AuthResponse>;
public class CreateUserCommandHandler(IIdentityService identityService, ITokenGeneratorService tokenGeneratorService, ICustomerRepository customerRepository)
         : IRequestHandler<CreateUserCommand, AuthResponse>
{
    private readonly IIdentityService _identityService = identityService;
    private readonly ITokenGeneratorService _tokenGeneratorService = tokenGeneratorService;
    private readonly ICustomerRepository _customerRepository = customerRepository;

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

        IList<string> roles = request.RegisterRequest.Roles;
        if (!request.RegisterRequest.Roles.Any())
        {
            request.RegisterRequest.Roles.Add("Customer");
        }
        var createResult = await _identityService.CreateUserAsync(
                            user,
                            request.RegisterRequest.Roles,
                            request.RegisterRequest.Password
                        );

        Customer customer = new();
        if (!roles.Any())
        {
            customer.UserId = user.Id;
            _customerRepository.Add(customer);
            await _customerRepository.SaveChangesAsync(cancellationToken);

        }


        if (createResult.Success)
        {
            var token = await _tokenGeneratorService.GenerateTokenAsync(user);
            authResponse.UserId = user.Id;
            authResponse.Email = user.Email;
            authResponse.FirstName = user.FirstName;
            authResponse.LastName = user.LastName;
            authResponse.CustomerId = customer.Id;
            authResponse.Token = token;
        }
        return await Task.FromResult(authResponse);
    }
}