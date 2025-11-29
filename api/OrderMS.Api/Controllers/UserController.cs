using MediatR;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Requests;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Features.Users.Commands;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ApiControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest registerRequest)
    {
        return Created("", await _sender.Send(new CreateUserCommand(registerRequest)));
    }
}