using FluentValidation;
using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Users.Commands.Update;

public record UpdateUserProfileCommand(UpdateProfileRequest UpdateRequest) : IRequest<ApiResponse<string>>;
public class UpdateUserProfileCommandHandler(IIdentityService identityService, IUserResolverService userResolverService) : IRequestHandler<UpdateUserProfileCommand, ApiResponse<string>>
{
    private readonly IIdentityService _identityService = identityService;
    private readonly IUserResolverService _userResolverService = userResolverService;

    public async Task<ApiResponse<string>> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<string> apiResponse = new();
        var currentUserId = _userResolverService.GetUserId();
        if (currentUserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("You are not authorized to perform this action.");
        }

        ApplicationUser? user = await _identityService.GetByIdAsync(currentUserId) ??
                                throw new ValidationException("User doesn't exist");


        if (!string.IsNullOrWhiteSpace(request.UpdateRequest.FirstName)) user.FirstName = request.UpdateRequest.FirstName;
        if (!string.IsNullOrWhiteSpace(request.UpdateRequest.LastName)) user.FirstName = request.UpdateRequest.LastName;
        if (!string.IsNullOrWhiteSpace(request.UpdateRequest.Address)) user.FirstName = request.UpdateRequest.Address;

        if (await _identityService.UpdateUserAsync(user))
        {
            apiResponse.Success = true;
            apiResponse.Data = "Operation Succeeded!";
            apiResponse.Message = "User updated successfully!";
        }

        return apiResponse;
    }
}