namespace OrderMS.Application.AppServices.Interfaces;

public interface IUserResolverService
{
    string? GetUserEmail();
    Guid GetUserId();
    string? GetLocale();
    Guid GetId();
    string? GetTokenId();
    string? GetTokenExpirationTime();
}
