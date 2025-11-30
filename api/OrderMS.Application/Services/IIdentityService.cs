

using OrderMS.Application.Dtos.Responses;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Services;

public interface IIdentityService
{
    Task<ApiResponse<int>> CreateUserAsync(ApplicationUser user, IList<Guid> roles, string password);
    Task<bool> AuthenticateUserAsync(string email, string password);
    Task<ApplicationUser?> GetUserByEmailAsync(string email);
    Task<bool> CreateRolesAsync(IList<string> roleNames);
    Task<List<RoleDto>> GetRolesAsync();
    Task<bool> IsInRoleAsync(Guid userId, string role);
    Task<bool> AssignUserToRole(Guid userId, IList<Guid> roles);

}