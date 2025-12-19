
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;
using OrderMS.Infrastructure.Persistence;
using OrderMS.Infrastructure.Services;
using StackExchange.Redis;

namespace OrderMS.Infrastructure;

public static class ServiceContainer
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.ConfigureDbContext(configuration);
        services.ConfigureIdentity(configuration);
        services.AddRepositories();

        return services;
    }

    public static IServiceCollection ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("PostgresqlConnection")
            ?? throw new InvalidOperationException("Connection string for PostgreSQL not found.");

        var redisConnectionString = configuration.GetConnectionString("RedisConnection")
            ?? throw new InvalidOperationException("Connection string for Redis not found.");

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            // options.UseMySql(
            //     connectionString,
            //     ServerVersion.AutoDetect(connectionString),
            //     mySqlOptions => mySqlOptions.EnableRetryOnFailure()
            // ).EnableSensitiveDataLogging();

            options.UseNpgsql(connectionString);
        }, ServiceLifetime.Scoped);

        var remoteRedisConnection = Environment.GetEnvironmentVariable("REDIS_CONNECTION")
            ?? throw new InvalidOperationException("Redis Connection not found from .env");

        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var options = ConfigurationOptions.Parse(redisConnectionString);
            options.AbortOnConnectFail = false;
            options.ConnectRetry = 5;
            options.ConnectTimeout = 5000;

            Console.WriteLine($"Parsed Redis Connection : {options}");

            return ConnectionMultiplexer.Connect(options);
        });

        Console.WriteLine($"Redis Connection from Environment Variable: {remoteRedisConnection}");

        return services;
    }

    public static IServiceCollection ConfigureIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettingsSection = configuration.GetSection("JwtSettings");
        services.Configure<JwtSettings>(jwtSettingsSection);
        var jwtSettings = jwtSettingsSection.Get<JwtSettings>() ?? new JwtSettings();

        services.AddIdentityCore<ApplicationUser>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.Password.RequireDigit = true;
            options.User.AllowedUserNameCharacters = "";
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 6;
        })
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(jwtOptions =>
            {
                jwtOptions.RequireHttpsMetadata = false;
                jwtOptions.SaveToken = true;
                jwtOptions.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
                    ClockSkew = jwtSettings.ExpiryInMinutes > 0
                        ? TimeSpan.FromMinutes(jwtSettings.ExpiryInMinutes)
                        : TimeSpan.Zero
                };

                jwtOptions.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var jti = context.Principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
                        if (string.IsNullOrEmpty(jti))
                        {
                            context.Fail("Unknown token.");
                            return;
                        }

                        var revokationService = context.HttpContext.RequestServices.GetRequiredService<ITokenRepository>();
                        if (await revokationService.IsTokenRevokedAsync(jti))
                        {
                            context.Fail("This token has been revoked prreviously.");
                        }
                    }
                };
            });

        services.AddAuthorization();

        services.AddHttpContextAccessor();

        return services;
    }

    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IUserResolverService, UserResolverService>();
        services.AddTransient<ITokenGeneratorService, TokenGeneratorService>();
        services.AddTransient<ITokenRepository, TokenRepository>();

        services.AddTransient(typeof(ICommonRepository<>), typeof(CommonRepository<>));
        services.AddTransient<IProductRepository, ProductRepository>();
        services.AddTransient<IFileService, FileService>();
        services.AddTransient<IFileRepository, FileRepository>();
        services.AddTransient<ICategoryRepository, CategoryRepository>();
        services.AddTransient<IOrderRepository, OrderRepository>();
        services.AddTransient<ICustomerRepository, CustomerRepository>();

        return services;
    }

}