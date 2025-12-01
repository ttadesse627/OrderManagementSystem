using FluentValidation;
using MediatR;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Users.Commands.Update;

public record UpdateUserCommand(Guid Id, UpdateRequest UpdateRequest) : IRequest<ApiResponse<string>>;
public class UpdateUserCommandHandler(IIdentityService identityService, ITokenGeneratorService tokenGeneratorService) : IRequestHandler<UpdateUserCommand, ApiResponse<string>>
{
    private readonly IIdentityService _identityService = identityService;
    private readonly ITokenGeneratorService _tokenGeneratorService = tokenGeneratorService;
    public async Task<ApiResponse<string>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<string> apiResponse = new();

        if (request.Id == Guid.Empty)
        {
            throw new ValidationException("User doesn't exist");
        }

        ApplicationUser? user = await _identityService.GetByIdAsync(request.Id) ??
                                throw new ValidationException("User doesn't exist");

        user.FirstName = request.UpdateRequest.FirstName;
        user.LastName = request.UpdateRequest.LastName;
        user.Address = request.UpdateRequest.Address;

        if (request.UpdateRequest.Roles.Any())
        {
            await _identityService.UpdateUserRolesAsync(user, request.UpdateRequest.Roles);
        }

        if (await _identityService.UpdateUserAsync(user))
        {
            apiResponse.Success = true;
            apiResponse.Data = "Operation Succeeded!";
            apiResponse.Message = "User updated successfully!";
        }

        return apiResponse;
    }
}