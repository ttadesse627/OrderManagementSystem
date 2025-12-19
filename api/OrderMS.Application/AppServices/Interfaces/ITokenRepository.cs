

using OrderMS.Domain.Entities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface ITokenRepository
{
    Task RemoveTokensAsync(Guid userId, CancellationToken cancellationToken);
    Task SaveTokenAsync(RefreshToken token, Guid userId, CancellationToken cancellationToken);

    Task RevokeTokensAsync(string jti, TimeSpan expirationTime);
    Task<bool> IsTokenRevokedAsync(string jti);
    Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken);
}