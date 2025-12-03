namespace OrderMS.Application.Services
{
    public interface IUserResolverService
    {
        string? GetUserEmail();
        Guid GetUserId();
        string? GetLocale();
        Guid GetId();
    }
}
