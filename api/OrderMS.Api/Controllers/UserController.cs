using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Features.Users.Commands;
using OrderMS.Application.Features.Users.Commands.Create;
using OrderMS.Application.Features.Users.Commands.Update;

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
    [Authorize]
    [HttpPut("update/{id}")]
    public async Task<ActionResult<AuthResponse>> Update(Guid id, [FromBody] UpdateRequest updateRequest)
    {
        return Ok(await _sender.Send(new UpdateUserCommand(id, updateRequest)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("delete/{id}")]
    public async Task<ActionResult<AuthResponse>> DeleteProfile(Guid id, RegisterRequest registerRequest)
    {
        return Created("", await _sender.Send(new CreateUserCommand(registerRequest)));
    }

    [Authorize(Roles = "Admin, User")]
    [HttpGet(Name = "Users")]
    public async Task<ActionResult<AuthResponse>> Get(RegisterRequest registerRequest)
    {
        return Created("", await _sender.Send(new CreateUserCommand(registerRequest)));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<AuthResponse>> GetProfile(Guid id, RegisterRequest registerRequest)
    {
        return Created("", await _sender.Send(new CreateUserCommand(registerRequest)));
    }
}