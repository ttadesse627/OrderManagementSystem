using FluentValidation;
using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Users.Commands.Update;

public record UpdateUserCommand(Guid Id, UpdateRequest UpdateRequest) : IRequest<ApiResponse<string>>;
public class UpdateUserCommandHandler(IIdentityService identityService) : IRequestHandler<UpdateUserCommand, ApiResponse<string>>
{
    private readonly IIdentityService _identityService = identityService;
    public async Task<ApiResponse<string>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<string> apiResponse = new();

        if (request.Id == Guid.Empty)
        {
            throw new ValidationException("User doesn't exist");
        }

        ApplicationUser? user = await _identityService.GetByIdAsync(request.Id) ??
                                throw new ValidationException("User doesn't exist");


        if (!string.IsNullOrWhiteSpace(request.UpdateRequest.FirstName)) user.FirstName = request.UpdateRequest.FirstName;
        if (!string.IsNullOrWhiteSpace(request.UpdateRequest.LastName)) user.LastName = request.UpdateRequest.LastName;
        if (!string.IsNullOrWhiteSpace(request.UpdateRequest.Address)) user.Address = request.UpdateRequest.Address;

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