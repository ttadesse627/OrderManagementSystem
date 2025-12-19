using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Domain.Entities;
using StackExchange.Redis;

namespace OrderMS.Infrastructure.Persistence;

public class TokenRepository(IConnectionMultiplexer redis,
                                IServiceScopeFactory scopeFactory,
                                ApplicationDbContext context) : ITokenRepository
{
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private readonly ApplicationDbContext _context = context;
    private readonly IDatabase _redisDb = redis.GetDatabase();

    public async Task SaveTokenAsync(RefreshToken token, Guid userId, CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Add(token);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveTokensAsync(Guid userId, CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await dbContext.RefreshTokens.Where(token => token.UserId == userId).ExecuteDeleteAsync(cancellationToken);
    }
    public async Task RevokeTokensAsync(string jti, TimeSpan expirationTime)
    {
        await _redisDb.StringSetAsync($"revoked_jti: {jti}", true, expirationTime);
    }
    public async Task<bool> IsTokenRevokedAsync(string jti)
    {
        return await _redisDb.KeyExistsAsync($"revoked_jti: {jti}");
    }

    public async Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken)
    {
        var token = await _context.RefreshTokens
            .Where(token => token.Token == refreshToken)
            .FirstOrDefaultAsync();

        return token;
    }
}