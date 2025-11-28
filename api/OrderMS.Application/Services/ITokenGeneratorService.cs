

using OrderMS.Domain.Entities;

namespace OrderMS.Application.Services;

public interface ITokenGeneratorService
{
    string GenerateToken(ApplicationUser user);
}