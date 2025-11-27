

using OrderMS.Application.Dtos.Responses;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Services;

public interface IIdentityService
{
    Task<bool> CreateUserAsync(ApplicationUser user, IList<Guid> roles, string password);
    Task<bool> AuthenticateUserAsync(string email, string password);
    Task<ApplicationUser?> GetUserByEmailAsync(string email);
    Task<bool> CreateRoleAsync(IList<string> roleNames);
    Task<List<RoleDto>> GetRolesAsync();
    Task<bool> IsInRoleAsync(Guid userId, string role);
    Task<bool> AssignUserToRole(Guid userId, IList<Guid> roles);

}