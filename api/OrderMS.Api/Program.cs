using Microsoft.AspNetCore.Authentication.JwtBearer;
using OrderMS.Api.Middlewares;
using OrderMS.Application;
using OrderMS.Infrastructure;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

string allowSpecificOrigins = "_allowSpecificoOrigins";

builder.Services.AddProblemDetails(configure =>
{
    configure.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier);
    };
});

builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
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
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddApplicationServices()
                .AddInfrastructureServices(builder.Configuration);

builder.Services.AddOpenApi();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseExceptionHandler();
app.UseHttpsRedirection();

app.UseCors(allowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

