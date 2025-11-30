

using OrderMS.Domain.Entities;

namespace OrderMS.Application.Services;

public interface ITokenGeneratorService
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
}