using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence
{
    public class IdentityService(ApplicationDbContext context,
                UserManager<ApplicationUser> userManager, RoleManager<IdentityRole<Guid>> roleManager)
                : CommonRepository<ApplicationUser>(context), IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;

        public async Task<ApiResponse<int>> CreateUserAsync(ApplicationUser user, IList<string> roles, string password)
        {
            var response = new ApiResponse<int>();

            ArgumentNullException.ThrowIfNull(user);
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentNullException(nameof(password));

            var existingUser = await _userManager.FindByEmailAsync(user.Email!);
            if (existingUser != null)
            {
                response.Message += "user with the given email already exists";
                throw new ValidationException("user with the given email already exists");
            }

            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                response.Errors = [.. result.Errors.Select(er => er.Description)];
                throw new InvalidOperationException(string.Join("; ", result.Errors));
            }

            if (roles.Count != 0)
            {
                await _userManager.AddToRolesAsync(user, roles);
            }

            List<Claim> claims = [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty)
            ];

            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r ?? string.Empty)));


            var claimResult = await _userManager.AddClaimsAsync(user, claims);
            if (!claimResult.Succeeded)
            {
                response.Errors.AddRange(claimResult.Errors.Select(err => err.Description));
                await _userManager.DeleteAsync(user);
            }

            response.Success = true;

            return response;
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

        public async Task<ApplicationUser?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
                throw new ArgumentNullException(nameof(id));

            return await _userManager.Users
                        .Where(user => user.Id == id)
                        .FirstOrDefaultAsync();
        }

        public async Task<bool> CreateRolesAsync(IList<string> roles)
        {
            if (!roles.Any())
                throw new ArgumentNullException(nameof(roles));

            foreach (var role in roles)
            {
                if (string.IsNullOrWhiteSpace(role))
                    continue;

                var exists = await _roleManager.RoleExistsAsync(role);
                if (exists)
                    continue;

                var roleEntity = new IdentityRole<Guid>
                {
                    Id = Guid.NewGuid(),
                    Name = role,
                    NormalizedName = role.ToUpperInvariant()
                };

                var result = await _roleManager.CreateAsync(roleEntity);
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

        public async Task<bool> AssignUserToRole(Guid userId, IList<string> roles)
        {
            List<string> errors = [];

            if (userId == Guid.Empty)
                throw new ArgumentNullException(nameof(userId), "User ID cannot be empty.");

            var user = await _userManager.FindByIdAsync(userId.ToString()) ??
                throw new ArgumentException("User not found.", nameof(userId));

            if (roles.Any())
            {
                foreach (var role in roles)
                {
                    var isRoleExist = await _roleManager.RoleExistsAsync(role);

                    if (!isRoleExist) errors.Add($"Role with name '{role}' not found.");

                    var result = await _userManager.AddToRoleAsync(user, role ?? string.Empty);
                    if (!result.Succeeded)
                    {
                        return false;
                    }
                }
            }

            var result2 = await _userManager.AddToRoleAsync(user, "Customer");
            if (!result2.Succeeded)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> UpdateUserRolesAsync(ApplicationUser user, IList<string> roles)
        {
            if (user is null)
                throw new ArgumentNullException(nameof(user), "Invalid user!");

            var oldRoles = await _userManager.GetRolesAsync(user);
            var identityResult = await _userManager.RemoveFromRolesAsync(user, oldRoles);
            if (!identityResult.Succeeded)
            {
                return identityResult.Succeeded;
            }

            if (roles.Any())
            {
                var filteredRoles = await GetFilteredRoles(roles);
                identityResult = await _userManager.AddToRolesAsync(user, filteredRoles);
            }

            return identityResult.Succeeded;
        }

        public async Task<bool> UpdateUserAsync(ApplicationUser user)
        {
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        private async Task<IList<string>> GetFilteredRoles(IList<string> roles)
        {
            IList<string> existingRoles = [];

            foreach (var role in roles)
            {
                if (await _roleManager.RoleExistsAsync(role))
                {
                    existingRoles.Add(role);
                }
            }

            return existingRoles;
        }


    }
}
