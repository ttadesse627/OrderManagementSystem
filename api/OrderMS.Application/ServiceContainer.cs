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
        services.AddScoped<IClientService, ClientService>();

        services.AddHttpClient("ProductsClient", config =>
        {
            config.BaseAddress = new Uri("https://temporal-warehouse.fly.dev/api/");
            config.Timeout = TimeSpan.FromSeconds(45);
            config.DefaultRequestHeaders.Clear();
        });

        services.AddHttpClient<ProductsClient>();
        services.AddHostedService<FileProcessorService>();
        services.AddHostedService<QueuedHostedService>();
        return services;
    }
}