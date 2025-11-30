using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;

namespace OrderMS.Infrastructure.Persistence;

public class TokenGeneratorService(IOptions<JwtSettings> options, UserManager<ApplicationUser> userManager) : ITokenGeneratorService
{
    private readonly JwtSettings _jwtSettings = options.Value;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<string> GenerateTokenAsync(ApplicationUser user)
    {
        var secretKey = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey ??
                        throw new InvalidOperationException("JWT Key not configured."));

        var userRoles = await _userManager.GetRolesAsync(user);

        List<Claim> claims = [
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty)
        ];

        claims.AddRange(userRoles.Select(ur => new Claim(ClaimTypes.Role, ur)));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience
        };
        var tokenHandler = new JsonWebTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return await Task.FromResult(token);
    }
}