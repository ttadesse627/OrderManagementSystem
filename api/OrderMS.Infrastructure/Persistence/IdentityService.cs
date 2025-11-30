using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence
{
    public class IdentityService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole<Guid>> roleManager) : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;

        public async Task<ApiResponse<int>> CreateUserAsync(ApplicationUser user, IList<Guid> roleIds, string password)
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

            var roleNames = await _roleManager.Roles
                .Where(role => roleIds.Contains(role.Id))
                .Select(r => r.Name ?? string.Empty)
                .ToListAsync();

            if (roleNames.Count != 0)
            {
                await _userManager.AddToRolesAsync(user, roleNames);
            }

            List<Claim> claims = [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty)
            ];

            claims.AddRange(roleNames.Select(r => new Claim(ClaimTypes.Role, r ?? string.Empty)));


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

        public async Task<bool> CreateRolesAsync(IList<string> roleNames)
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