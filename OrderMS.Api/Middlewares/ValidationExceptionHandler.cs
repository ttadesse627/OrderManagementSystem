using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace OrderMS.Api.Middlewares;

public class ValidationExceptionHandler(IProblemDetailsService problemDetailsService, ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailsService = problemDetailsService;
    private readonly ILogger<GlobalExceptionHandler> _logger = logger;

    // Implementation for global exception handling middleware
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not ValidationException validationException)
        {
            return false;
        }

        _logger.LogError(exception, "A validation exception occurred.");

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;


        var context = new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails
            {
                Type = exception.GetType().Name,
                Title = " An Error Occurred",
                Status = httpContext.Response.StatusCode,
                Detail = exception.Message
            }
        };

        var errors = validationException.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key.ToLowerInvariant(),
                g => g.Select(e => e.ErrorMessage).ToArray()
            );

        context.ProblemDetails.Extensions.Add("errors", errors);

        return await _problemDetailsService.TryWriteAsync(context);
    }
}