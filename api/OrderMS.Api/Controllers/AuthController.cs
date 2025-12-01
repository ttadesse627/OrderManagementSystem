using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Features.Users.Commands;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ApiControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest loginRequest)
    {
        return Ok(await _sender.Send(new LoginCommand(loginRequest)));
    }
}