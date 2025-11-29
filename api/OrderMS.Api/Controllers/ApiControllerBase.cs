using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace OrderMS.Api.Controllers;

public class ApiControllerBase : ControllerBase
{
    private ISender _mediator = null!;
    protected ISender _sender => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
}