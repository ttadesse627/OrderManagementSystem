using Microsoft.Extensions.DependencyInjection;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.AppServices.Services;
using OrderMS.Application.Services;

namespace OrderMS.Application;

public static class ServiceContainer
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ServiceContainer).Assembly));

        services.AddTransient<IOrderCalculationService, OrderCalculationService>();
        services.AddHostedService<FileProcessorService>();
        services.AddHostedService<QueuedHostedService>();
        return services;
    }
}