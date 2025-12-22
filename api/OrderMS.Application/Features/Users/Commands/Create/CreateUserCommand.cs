using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Users.Commands.Create;

public record CreateUserCommand(RegisterRequest RegisterRequest) : IRequest<ApiResponse<AuthResponse>>;
public class CreateUserCommandHandler(
                            IIdentityService identityService,
                            ITokenGeneratorService tokenGeneratorService,
                            ICustomerRepository customerRepository,
                            IUserResolverService userResolverService) : IRequestHandler<CreateUserCommand, ApiResponse<AuthResponse>>
{
    private readonly IIdentityService _identityService = identityService;
    private readonly ITokenGeneratorService _tokenGeneratorService = tokenGeneratorService;
    private readonly ICustomerRepository _customerRepository = customerRepository;
    private readonly IUserResolverService _userResolverService = userResolverService;

    public async Task<ApiResponse<AuthResponse>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var userValidator = new CreateUserCommandValidator();

        await userValidator.ValidateAsync(request, cancellationToken);

        var user = new ApplicationUser
        {
            FirstName = request.RegisterRequest.FirstName,
            LastName = request.RegisterRequest.LastName,
            Email = request.RegisterRequest.Email,
            UserName = request.RegisterRequest.Email,
            Address = request.RegisterRequest.Address
        };

        bool rolesWereEmpty = !request.RegisterRequest.Roles.Any();


        if (rolesWereEmpty)
        {
            request.RegisterRequest.Roles.Add("Customer");
        }

        var createResult = await _identityService.CreateUserAsync(
                            user,
                            request.RegisterRequest.Roles,
                            request.RegisterRequest.Password
                        );

        if (!createResult.Success)
        {
            return new ApiResponse<AuthResponse>
            {
                Success = false,
                Message = string.Join(", ", createResult.Errors)
            };
        }

        Customer customer = new();
        if (rolesWereEmpty)
        {
            customer.UserId = user.Id;
            _customerRepository.Add(customer);
            await _customerRepository.SaveChangesAsync(cancellationToken);
        }

        var currentUserId = _userResolverService.GetUserId();
        var apiResponse = new ApiResponse<AuthResponse>()
        {
            Success = true,
            Message = currentUserId == Guid.Empty ? "You have registered successfully." : "User created successfully."
        };
        if (currentUserId == Guid.Empty)
        {
            apiResponse.Data = new AuthResponse
            {
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = await _tokenGeneratorService.GenerateTokenAsync(user),
                RefreshToken = _tokenGeneratorService.GenerateRefreshToken()
            };
        }

        return apiResponse;
    }
}