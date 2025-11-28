using MediatR;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Features.Users.Commands;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(string email, string password)
    {
        return Ok(await _sender.Send(new LoginCommand(email, password)));
    }
}