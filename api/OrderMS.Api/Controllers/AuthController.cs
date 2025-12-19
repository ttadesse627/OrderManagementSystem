using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Features.Auth.Commands;

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

    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] string refreshToken)
    {
        return Ok(await _sender.Send(new LoginWithRefreshTokenCommand(refreshToken)));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await _sender.Send(new LogoutCommand());

        return NoContent();
    }
}