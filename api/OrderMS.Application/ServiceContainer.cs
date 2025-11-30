using Microsoft.Extensions.DependencyInjection;
using OrderMS.Application.Services;

namespace OrderMS.Application;

public static class ServiceContainer
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ServiceContainer).Assembly));

        services.AddHostedService<FileProcessorService>();
        return services;
    }
}