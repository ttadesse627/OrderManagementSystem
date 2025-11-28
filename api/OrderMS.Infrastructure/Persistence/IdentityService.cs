using Microsoft.AspNetCore.Identity;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence
{
    public class IdentityService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole<Guid>> roleManager) : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;

        public async Task<bool> CreateUserAsync(ApplicationUser user, IList<Guid> roles, string password)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentNullException(nameof(password));

            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return false;
            }

            if (roles != null && roles.Any())
            {
                foreach (var roleId in roles)
                {
                    var role = await _roleManager.FindByIdAsync(roleId.ToString());
                    if (role == null)
                        throw new ArgumentException($"Role with id '{roleId}' not found.", nameof(roles));

                    var addToRoleResult = await _userManager.AddToRoleAsync(user, role.Name ?? string.Empty);
                    if (!addToRoleResult.Succeeded)
                    {
                        var addErrors = string.Join(", ", addToRoleResult.Errors.Select(e => e.Description));
                        // Optionally rollback user creation here. For now report failure.
                        return false;
                    }
                }
            }

            return true;
        }

        public async Task<bool> AuthenticateUserAsync(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                throw new ArgumentNullException("Email or password cannot be null or empty.");
            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);

            if (!isPasswordValid)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }
            return isPasswordValid;
        }

        public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentNullException(nameof(email));

            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<bool> CreateRoleAsync(IList<string> roleNames)
        {
            if (roleNames == null || !roleNames.Any())
                throw new ArgumentNullException(nameof(roleNames));

            foreach (var roleName in roleNames)
            {
                if (string.IsNullOrWhiteSpace(roleName))
                    continue;

                var exists = await _roleManager.RoleExistsAsync(roleName);
                if (exists)
                    continue;

                var role = new IdentityRole<Guid>
                {
                    Id = Guid.NewGuid(),
                    Name = roleName,
                    NormalizedName = roleName.ToUpperInvariant()
                };

                var result = await _roleManager.CreateAsync(role);
                if (!result.Succeeded)
                {
                    return false;
                }
            }

            return true;
        }

        public Task<List<RoleDto>> GetRolesAsync()
        {
            var roles = _roleManager.Roles.Select(role => new RoleDto(role.Id, role.Name ?? string.Empty))
                .ToList();

            return Task.FromResult(roles);
        }

        public async Task<bool> IsInRoleAsync(Guid userId, string role)
        {
            if (userId == Guid.Empty)
                throw new ArgumentNullException(nameof(userId));
            if (string.IsNullOrWhiteSpace(role))
                throw new ArgumentNullException(nameof(role));

            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return false;

            return await _userManager.IsInRoleAsync(user, role);
        }

        public async Task<bool> AssignUserToRole(Guid userId, IList<Guid> roles)
        {
            if (roles == null || !roles.Any())
                throw new ArgumentNullException(nameof(roles), "No role id is provided.");

            if (userId == Guid.Empty)
                throw new ArgumentNullException(nameof(userId), "User ID cannot be empty.");

            var user = await _userManager.FindByIdAsync(userId.ToString()) ??
                throw new ArgumentException("User not found.", nameof(userId));

            foreach (var roleId in roles)
            {
                var role = await _roleManager.FindByIdAsync(roleId.ToString()) ??
                    throw new ArgumentException($"Role with id '{roleId}' not found.", nameof(roles));

                var result = await _userManager.AddToRoleAsync(user, role.Name ?? string.Empty);
                if (!result.Succeeded)
                {
                    return false;
                }
            }

            return true;
        }
    }
}