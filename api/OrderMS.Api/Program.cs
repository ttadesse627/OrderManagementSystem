using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.OpenApi.Models;
using OrderMS.Api.Middlewares;
using OrderMS.Application;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

string allowSpecificOrigins = "_allowSpecificoOrigins";

builder.Services.AddProblemDetails(o =>
{
    o.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Instance = $"{context.HttpContext.Request.Method} {context.HttpContext.Request.Path}";
        context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier);
        Activity? activity = context.HttpContext.Features.Get<IHttpActivityFeature>()?.Activity;
        context.ProblemDetails.Extensions.TryAdd("traceId", activity?.Id);
    };
});

builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
                .AllowAnyHeader();
    });
});

builder.Services.AddApplicationServices()
                .AddInfrastructureServices(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Order MS API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});



WebApplication app = builder.Build();

// if (app.Environment.IsDevelopment())
// {
//     // app.MapOpenApi();
//     // app.MapScalarApiReference();
app.UseSwagger();
app.UseSwaggerUI();


app.Use(async (context, next) =>
{
    Console.WriteLine($"User is authenticated: {context.User.Identity?.IsAuthenticated}");
    await next();
});

using (var scope = app.Services.CreateScope())
{
    var identityservice = scope.ServiceProvider.GetRequiredService<IIdentityService>();
    await identityservice.SeedIdentitiesAsync(scope.ServiceProvider);
    await identityservice.SeedIdentitiesAsync(scope.ServiceProvider);
}

app.UseStaticFiles();
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseStatusCodePages();
app.UseCors(allowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

