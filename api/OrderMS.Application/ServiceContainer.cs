using Microsoft.Extensions.DependencyInjection;

namespace OrderMS.Application;

public static class ServiceContainer
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ServiceContainer).Assembly));

        return services;
    }
}