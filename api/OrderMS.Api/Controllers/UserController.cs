using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Features.Users.Commands;
using OrderMS.Application.Features.Users.Commands.Create;
using OrderMS.Application.Features.Users.Commands.Delete;
using OrderMS.Application.Features.Users.Commands.Update;
using OrderMS.Application.Features.Users.Queries;

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
    public async Task<ActionResult<ApiResponse<string>>> Update(Guid id, [FromBody] UpdateRequest updateRequest)
    {
        return Ok(await _sender.Send(new UpdateUserCommand(id, updateRequest)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("delete/{id}")]
    public async Task<ActionResult<AuthResponse>> DeleteProfile(Guid id)
    {
        return Ok(await _sender.Send(new DeleteUserCommand(id)));
    }

    [Authorize(Roles = "Admin, User")]
    [HttpGet(Name = "Users")]
    public async Task<ActionResult<AuthResponse>> Get(
        int pageNumber = 1,
        int pageSize = 15,
        string? sortBy = null,
        bool sortDescending = false)
    {
        return Ok(await _sender.Send(new GetUsersQuery(pageNumber, pageSize, sortBy, sortDescending)));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<AuthResponse>> GetProfile(Guid id)
    {
        return Ok(await _sender.Send(new GetUserByIdQuery(id)));
    }
}