

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;

namespace OrderMS.Infrastructure.Persistence;

public class TokenGeneratorService(IOptions<JwtSettings> options, UserManager<ApplicationUser> userManager) : ITokenGeneratorService
{
    private readonly JwtSettings _jwtSettings = options.Value;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public string GenerateToken(ApplicationUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var secretKey = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey ?? throw new InvalidOperationException("JWT Key not configured."));

        var userRoles = _userManager.GetRolesAsync(user).Result;

        string joinedRoles = string.Join(",", userRoles);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim(ClaimTypes.Role, joinedRoles),
            ]),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}