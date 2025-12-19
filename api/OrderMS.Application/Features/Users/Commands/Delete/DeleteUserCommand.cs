using FluentValidation;
using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Enums;

namespace OrderMS.Application.Features.Users.Commands.Delete;

public record DeleteUserCommand(Guid Id) : IRequest<ApiResponse<string>>;
public class DeleteUserCommandHandler(IIdentityService identityService) : IRequestHandler<DeleteUserCommand, ApiResponse<string>>
{
    private readonly IIdentityService _identityService = identityService;
    public async Task<ApiResponse<string>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<string> apiResponse = new();

        if (request.Id == Guid.Empty)
        {
            throw new ValidationException("User doesn't exist");
        }

        ApplicationUser? user = await _identityService.GetByIdAsync(request.Id) ??
                                throw new ValidationException("User doesn't exist");

        user.Status = UserStatus.Deleted;


        if (await _identityService.UpdateUserAsync(user))
        {
            apiResponse.Success = true;
            apiResponse.Data = "Operation Succeeded!";
            apiResponse.Message = "User Deleted successfully!";
        }

        return apiResponse;
    }
}