

using OrderMS.Domain.Entities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface ITokenGeneratorService
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
    string GenerateRefreshToken();
}