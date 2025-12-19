using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IIdentityService : ICommonRepository<ApplicationUser>
{
    Task<ApiResponse<int>> CreateUserAsync(ApplicationUser user, IList<string> roles, string password);
    Task<bool> AuthenticateUserAsync(string email, string password);
    Task<ApplicationUser?> GetUserByEmailAsync(string email);
    Task<ApplicationUser?> GetByIdAsync(Guid id);
    Task<bool> CreateRolesAsync(IList<string> roleNames);
    Task<bool> UpdateUserRolesAsync(ApplicationUser user, IList<string> roles);
    Task<bool> UpdateUserAsync(ApplicationUser user);
    Task<List<RoleDto>> GetRolesAsync();
    Task<IReadOnlyList<string>> GetUserRolesAsync(ApplicationUser user);
    Task<bool> IsInRoleAsync(Guid userId, string role);
    Task<bool> AssignUserToRole(Guid userId, IList<string> roles);
    Task SeedIdentitiesAsync(IServiceProvider services);

}